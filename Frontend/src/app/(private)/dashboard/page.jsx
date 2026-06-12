"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import Header from "@/components/Header";

import PatientService from "@/services/PatientService";
import AttendanceService from "@/services/AttendanceService";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    calculatedScores: 0,
    highRiskPatients: 0,
    averageScore: 0,
  });

  useEffect(() => { 
    async function loadPatients() {
      const allPatients = await PatientService.getAll();
      const allAttendances = await AttendanceService.getAll();

      setPatients(allPatients);
      setAttendances(allAttendances);

      const calculatedScores = allAttendances.filter(
        (attendance) => attendance.score_risco !== undefined,
      ).length;

      const highRiskPatients = allAttendances.filter(
        (attendance) => attendance.score_risco >= 77,
      ).length;

      const totalScore = allAttendances.reduce(
        (sum, attendance) => sum + (attendance.score_risco || 0),
        0,
      );

      const averageScore = allPatients.length > 0 ? Math.round(totalScore / allPatients.length) : 0;

      setStats({
        totalPatients: allPatients.length,
        calculatedScores,
        highRiskPatients,
        averageScore,
      })
    }

    loadPatients();
  }, []);
  
  const pieData = [
    {
      name: "Alto Risco",
      value: attendances.filter((a) => a.score_risco >= 70).length,
    },
    {
      name: "Risco Moderado",
      value: attendances.filter((a) => a.score_risco >= 40 && a.score_risco <= 69).length,
    },
    {
      name: "Baixo Risco",
      value: attendances.filter((a) => a.score_risco >= 0 && a.score_risco <= 39).length,
    },
  ];

  const chartColors = ["#dc2626", "#d97706", "#16a34a"];

  const getBarColor = (status) => {
    switch (status) {
      case "Alto Risco":
        return "#dc2626";
      case "Risco Moderado":
        return "#d97706";
      case "Baixo Risco":
        return "#16a34a";
      default:
        return "#3b82f6";
    }
  };

  const scoreData = patients.slice(0, 8).map((patient, index) => {
    const latest = attendances
      .filter((a) => a.paciente === patient.CPF_Paciente)
      .sort((a, b) => new Date(b.data_de_consulta) - new Date(a.data_de_consulta))[0];

    const attendance = latest;

    console.log(JSON.stringify(latest));

    const score = attendance?.score_risco ?? 0;
    const status =
      score <= 40 ? "Baixo Risco" : score <= 70 ? "Risco Moderado" : "Alto Risco";

    return {
      nome: patient.nome?.split(" ")[0] || "Paciente",
      score,
      status,
    };
  });

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Dashboard"
          subtitle="Visão geral dos pacientes cadastrados."
        />

        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <p className="text-slate-600 font-medium">Pacientes Ativos</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-3">
                {stats.totalPatients}
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <p className="text-slate-600 font-medium">Scores Calculados</p>
              <h2 className="text-4xl font-bold text-green-600 mt-3">
                {stats.calculatedScores}
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <p className="text-slate-600 font-medium">Casos de Alto Risco</p>
              <h2 className="text-4xl font-bold text-red-600 mt-3">
                {stats.highRiskPatients}
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <p className="text-slate-600 font-medium">Score Médio</p>
              <h2 className="text-4xl font-bold text-indigo-600 mt-3">
                {stats.averageScore}%
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">
                Distribuição de Risco
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={chartColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">
                Scores Recentes
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="score">
                    {scoreData.map((entry, index) => (
                      <Cell key={index} fill={getBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
