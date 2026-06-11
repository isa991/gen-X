"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";

import PatientService from "@/services/PatientService";

export default function PatientDetails() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    async function findPatient() {
      const found = await PatientService.getByCpf(params.cpf);
      setPatient(found || null);
    }
    findPatient();
  }, [params.cpf]);

  if (!patient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            Paciente não encontrado
          </h1>
        </div>
      </main>
    );
  }

  const getRiskColor = (score) => {
    const value = Number(score);

    if (value >= 70) return "text-red-600";
    if (value >= 40) return "text-amber-600";
    return "text-green-600";
  };

  const history = [
    ...(patient.evaluations || []),
    ...(patient.attendances || []),
  ].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const scoreHistory = history
    .filter((item) => item.riskScore !== undefined && item.date)
    .map((item, index) => ({
      index,
      date: new Date(item.date).toLocaleDateString("pt-BR"),
      score: Number(item.riskScore),
    }));

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title={patient.nome} subtitle={`CPF: ${patient.cpf}`} />

        <div className="p-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Ficha do Paciente
                </h2>
                <p className="text-slate-500 text-sm">
                  Informações gerais e dados clínicos registrados
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    router.push(`/pacientes/${patient.cpf}/editar`)
                  }
                  className="px-5 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
                >
                  Editar
                </button>

                <button
                  onClick={() => router.push(`/pacientes/${patient.cpf}/score`)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Calcular Score
                </button>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Nome completo</p>
                <p className="text-lg font-semibold">{patient.nome}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">CPF</p>
                <p className="text-lg font-semibold">{patient.CPF_Paciente}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Sexo</p>
                <p className="text-lg font-semibold">{patient.sexo || "-"}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Responsável atual</p>
                <p className="text-lg font-semibold">
                  {patient.guardian || "-"}
                </p>
              </div>
            </div>
          </div>

          {scoreHistory.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Evolução do Score
              </h2>

              <div className="w-full h-64 relative">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    points={scoreHistory
                      .map((d, i) => {
                        const x =
                          (i / (scoreHistory.length - 1 || 1)) * 560 + 20;
                        const y = 180 - (d.score / 100) * 160;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {scoreHistory.map((d, i) => {
                    const x = (i / (scoreHistory.length - 1 || 1)) * 560 + 20;
                    const y = 180 - (d.score / 100) * 160;

                    return (
                      <circle key={i} cx={x} cy={y} r="5" fill="#2563eb" />
                    );
                  })}
                </svg>

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  {scoreHistory.map((d, i) => (
                    <span key={i}>{d.date}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Avaliação Atual
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-slate-500">Score de risco</p>
                <p
                  className={`text-5xl font-bold ${getRiskColor(
                    patient.riskScore,
                  )}`}
                >
                  {patient.riskScore || 0}%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Classificação</p>
                <RiskBadge status={patient.status} />
              </div>

              <button
                onClick={() =>
                  router.push(`/pacientes/${patient.cpf}/resultado`)
                }
                className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
              >
                Ver Resultado Completo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Histórico de Atendimentos
            </h2>

            {history.length > 0 ? (
              <div className="space-y-6">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <p className="text-sm text-slate-500">
                        {" "}
                        {item.date
                          ? new Date(item.date).toLocaleString("pt-BR")
                          : "Data não informada"}
                      </p>

                      <p className="text-sm text-slate-500">
                        CRM:{" "}
                        <span className="text-slate-700 font-medium">
                          {item.crm || "-"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 text-sm text-slate-600">
                      Responsável:{" "}
                      <strong className="text-slate-800">
                        {item.guardian || "-"}
                      </strong>{" "}
                      <span className="text-slate-500">
                        — {item.relationship || "sem parentesco informado"}
                      </span>
                    </div>

                    {item.symptoms?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Sintomas
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.symptoms.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.description && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-700 mb-1">
                          Descrição
                        </p>

                        <p className="text-slate-700 text-sm whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {item.riskScore !== undefined && (
                      <p className="mt-4 font-bold text-slate-800">
                        Score: {item.riskScore}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Nenhum atendimento registrado.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
