"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";
import StatisticsCard from "@/components/StatisticsCard";

import PatientService from "@/services/PatientService";
import AttendanceService from "@/services/AttendanceService";

export default function Relatorios() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    highRisk: 0,
    moderateRisk: 0,
    lowRisk: 0,
    averageScore: 0,
  });

  useEffect(() => {
    async function loadPatient() {
      const allPatients = await PatientService.getAll();
      setPatients(allPatients);

      const allAttendances = await AttendanceService.getAll();
      setAttendances(allAttendances);

      const highRisk = allAttendances.filter((a) => a.score_do_paciente >= 70 ? "Alto Risco" : "").length;
      const moderateRisk = allAttendances.filter((a) => a.score_do_paciente >= 40 && a.score_do_paciente <= 69 ? "Risco Moderado" : "").length;
      const lowRisk = allAttendances.filter((a) => a.score_do_paciente >= 0 && a.score_do_paciente <= 39 ? "Baixo Risco" : "").length;

      const totalScore = allAttendances.reduce((sum, a) => sum + (a.score_do_paciente || 0), 0);

      const averageScore = allAttendances.length > 0 ? Math.round(totalScore / allAttendances.length) : 0;

      setStatistics({
        total: allAttendances.length,
        highRisk,
        moderateRisk,
        lowRisk,
        averageScore,
      });
    }
    loadPatient();
  }, []);

    const patientMap = useMemo(() => {
      return patients.reduce((acc, patient) => {
        acc[patient.CPF_Paciente] = patient;
        return acc;
      }, {});
    }, [patients]);

    const formatCPF = (value = "") => {
      const numbers = value.replace(/\D/g, "");

      return numbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    };

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title="Relatórios" subtitle="Visão consolidada dos pacientes" />

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-5 gap-6">
            <StatisticsCard title="Total" value={statistics.total} />
            <StatisticsCard title="Alto Risco" value={statistics.highRisk} />
            <StatisticsCard title="Moderado" value={statistics.moderateRisk} />
            <StatisticsCard title="Baixo" value={statistics.lowRisk} />
            <StatisticsCard
              title="Média"
              value={`${statistics.averageScore}%`}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-3 text-left text-slate-600 font-medium">
                    Nome
                  </th>
                  <th className="p-3 text-left text-slate-600 font-medium">
                    CPF
                  </th>
                  <th className="p-3 text-left text-slate-600 font-medium">
                    Data da consulta
                  </th>
                  <th className="p-3 text-left text-slate-600 font-medium">
                    Score
                  </th>
                  <th className="p-3 text-left text-slate-600 font-medium">
                    Status
                  </th>
                  <th className="p-3 text-left text-slate-600 font-medium">
                    Relatório
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendances.map((attendance) => {
                  const patient = patientMap[attendance.paciente];

                  const score = attendance.score_do_paciente || 0;

                  return (
                    <tr
                      key={attendance.id_consulta}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td className="p-3 text-slate-800">{patient?.nome}</td>

                      <td className="p-3 text-slate-700">{formatCPF(attendance.paciente)}</td>

                      <td className="p-3 text-slate-700">
                        {attendance.data_de_consulta
                          ? new Date(attendance.data_de_consulta).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>

                      <td className="p-3 text-slate-700">
                        {score}%
                      </td>

                      <td className="p-3">
                        <RiskBadge status={score <= 40 ? "Baixo Risco" : score <= 70 ? "Risco Moderado" : "Alto Risco"} />
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() =>
                            router.push(`/pacientes/${attendance.paciente}/relatorio/${attendance.id_consulta}`)
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Ver relatório
                        </button>
                      </td>
                    </tr>
                  );})}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
