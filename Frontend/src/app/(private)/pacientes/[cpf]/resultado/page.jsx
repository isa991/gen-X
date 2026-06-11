"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Header from "@/components/Header";

import PatientService from "@/services/PatientService";

export default function Resultado() {
  const params = useParams();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const p = PatientService.getByCpf(params.cpf);

    if (!p) return;

    setPatient(p);
  }, [params.cpf]);

  if (!patient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-sm">
          <h1>Carregando resultado...</h1>
        </div>
      </main>
    );
  }

  const getRiskStatus = (score) => {
    const value = Number(score);

    if (value >= 70) return "Alto Risco";
    if (value >= 40) return "Risco Moderado";
    return "Baixo Risco";
  };

  const status = getRiskStatus(patient.riskScore || 0);

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title="Resultado da Avaliação" subtitle={patient.fullName} />

        <div className="p-8">
          <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
            <h2 className="text-slate-500 mb-4">Score Final</h2>

            <div
              className={`text-7xl font-bold ${
                status === "Alto Risco"
                  ? "text-red-600"
                  : status === "Risco Moderado"
                    ? "text-amber-600"
                    : "text-green-600"
              }`}
            >
              {patient.riskScore}%
            </div>

            <span
              className={`mt-8 inline-block px-6 py-3 rounded-full font-medium ${
                status === "Alto Risco"
                  ? "bg-red-100 text-red-700"
                  : status === "Risco Moderado"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
