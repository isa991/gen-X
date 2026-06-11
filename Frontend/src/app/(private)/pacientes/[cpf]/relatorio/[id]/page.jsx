"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";

import PatientService from "@/services/PatientService";
import AttendanceService from "@/services/AttendanceService";
import GuardianService from "@/services/GuardianService";

export default function RelatorioPaciente() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [guardian, setGuardian] = useState(null);

  useEffect(() => {
    async function findPatient() {
      const found = await PatientService.getByCpf(params.cpf);
      setPatient(found || null);

      const foundAtt = await AttendanceService.getById(params.id);
      setAttendance(foundAtt || null);
    }
    findPatient();
  }, [params.cpf]);


  useEffect(() => {
    async function findGuardian() {
      if (!attendance?.responsavel) return ;

      const foundGuardian = await GuardianService.getByCpf(attendance?.responsavel);
      setGuardian(foundGuardian || null);
    }
    findGuardian();
  }, [attendance?.responsavel])

  if (!patient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-sm">
          <h1 className="text-2xl font-semibold">Paciente não encontrado</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Relatório Clínico"
          subtitle="Resumo consolidado da avaliação"
        />

        <div className="p-8">
          <div className="bg-white rounded-3xl shadow-sm p-10 space-y-10">
            <section>
              <h2 className="text-xl font-semibold mb-6">Identificação</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p>Nome</p>
                  <p className="font-medium">{patient.nome}</p>
                </div>

                <div>
                  <p>CPF</p>
                  <p className="font-medium">{patient.CPF_Paciente}</p>
                </div>

                <div>
                  <p>Sexo</p>
                  <p>{patient.sexo || "-"}</p>
                </div>

                <div>
                  <p>Responsável</p>
                  <p>{guardian?.nome || "-"}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6">Sintomas</h2>

              <div className="flex flex-wrap gap-3">
                {attendance?.sintomas ? (
                  attendance?.sintomas.split(", ").map((s) => (
                    <span key={s} className="px-3 py-1 bg-blue-50 rounded-full">
                      {s}
                    </span>
                  ))
                ) : (
                  <p>Nenhum sintoma registrado.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6">Resultado</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <p>Score</p>
                  <h3 className="text-5xl text-blue-600 font-bold">
                    {attendance?.score_risco || 0}%
                  </h3>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl">
                  <RiskBadge status={attendance?.score_risco <= 40 ? "Baixo Risco" : attendance?.score_risco <= 70 ? "Risco Moderado" : "Alto Risco"} />
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
