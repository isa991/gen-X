"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PatientService from "@/services/PatientService";
import { calculateScore, determineRisk } from "@/utils/calculateScore";

export default function ScorePage() {
  const params = useParams();
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function doStuff() {
      const patient = PatientService.getByCpf(params.cpf);

      if (!patient) {
        router.push("/pacientes");
        return;
      }

      let value = 0;

      const interval = setInterval(() => {
        value += Math.floor(Math.random() * 10) + 5;

        if (value >= 100) {
          clearInterval(interval);

          // Correct this to pull symptoms from historico_de_consulta
          const symptoms = Array.isArray(patient.symptoms)
            ? patient.symptoms
            : [];

          const scoreRaw = calculateScore(symptoms);

          const score = Number.isFinite(scoreRaw) ? scoreRaw : 0;

          const status = determineRisk(score);

          console.log("SCORE FINAL:", score, "SYMPTOMS:", symptoms);

          router.push(
            `/pacientes/${params.cpf}/resultado?score=${encodeURIComponent(
              score,
            )}&status=${encodeURIComponent(status)}`,
          );
        } else {
          setProgress(value);
        }
      }, 70);

      return () => clearInterval(interval);
    }
    doStuff();
  }, [params.cpf, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-6">
          Processando análise clínica...
        </h1>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-3 bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-5xl font-bold text-blue-600">{progress}%</p>
      </div>
    </main>
  );
}
