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

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    calculatedScores: 0,
    highRiskPatients: 0,
    averageScore: 0,
  });

  useEffect(() => { 
    async function loadPatients() {
      const allPatients = await PatientService.getAll();

      setPatients(allPatients);

      /*
      const calculatedScores = allPatients.filter(
        (patient) => patient.riskScore !== undefined,
      ).length;

      const highRiskPatients = allPatients.filter(
        (patient) => patient.status === "Alto Risco",
      ).length;

      const totalScore = allPatients.reduce(
        (sum, patient) => sum + (patient.riskScore || 0),
        0,
      );

      const averageScore =
        totalPatients > 0 ? Math.round(totalScore / totalPatients) : 0;
      */

      setStats({
        totalPatients: allPatients.length,
        calculatedScores: 0,
        highRiskPatients: 0,
        averageScore: 0,
      })
    }

    loadPatients();
  }, []);
  
  const pieData = [
    {
      name: "Alto Risco",
      value: 1// patients.filter((p) => p.status === "Alto Risco").length,
    },
    {
      name: "Risco Moderado",
      value: 1//patients.filter((p) => p.status === "Risco Moderado").length,
    },
    {
      name: "Baixo Risco",
      value: 1//patients.filter((p) => p.status === "Baixo Risco").length,
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

  const scoreData = patients.slice(0, 8).map((patient) => ({
    nome: patient.nome?.split(" ")[0] || "Paciente",
    score: patient.riskScore || 0,
    status: patient.status || "Não definido",
  }));

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
