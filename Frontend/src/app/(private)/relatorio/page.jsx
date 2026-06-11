"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";
import StatisticsCard from "@/components/StatisticsCard";

import PatientService from "@/services/PatientService";

export default function Relatorios() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    highRisk: 0,
    moderateRisk: 0,
    lowRisk: 0,
    averageScore: 0,
  });

  useEffect(() => {
    async function loadPatient() {
      const all = await PatientService.getAll();
      setPatients(all);

      const highRisk = all.filter((p) => p.status === "Alto Risco").length;
      const moderateRisk = all.filter(
        (p) => p.status === "Risco Moderado",
      ).length;
      const lowRisk = all.filter((p) => p.status === "Baixo Risco").length;

      const totalScore = all.reduce((sum, p) => sum + (p.riskScore || 0), 0);

      const averageScore =
        all.length > 0 ? Math.round(totalScore / all.length) : 0;

      setStatistics({
        total: all.length,
        highRisk,
        moderateRisk,
        lowRisk,
        averageScore,
      });
    }
    loadPatient();
  }, []);

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
                {patients.map((patient) => (
                  <tr
                    key={patient.CPF_Paciente}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3 text-slate-800">{patient.nome}</td>

                    <td className="p-3 text-slate-700">{patient.CPF_Paciente}</td>

                    <td className="p-3 text-slate-700">
                      {patient.riskScore || 0}%
                    </td>

                    <td className="p-3">
                      <RiskBadge status={patient.status} />
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          router.push(`/pacientes/${patient.CPF_Paciente}/relatorio`)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-lg"
                      >
                        Ver relatório
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
