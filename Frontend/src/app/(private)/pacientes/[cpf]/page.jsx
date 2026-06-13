"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import RiskBadge from "@/components/RiskBadge";
import PhotoModal from "@/components/PhotoModal";

import PatientService from "@/services/PatientService";
import AttendanceService from "@/services/AttendanceService";
import GuardianService from "@/services/GuardianService";

export default function PatientDetails() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [recentAttendance, setAttendance] = useState(null);
  const [responsavel, setResponsavel] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  

  useEffect(() => {
  async function findPatient() {
    const found = await PatientService.getByCpf(params.cpf);
    setPatient(found || null);

    const allAttendances = await AttendanceService.getAllByCpf(params.cpf);

    const sortedAttendances = allAttendances.sort(
      (a, b) =>
        new Date(b.data_de_consulta) - new Date(a.data_de_consulta)
    );

    setAttendances(sortedAttendances);
    setAttendance(sortedAttendances[0] || null);

    // Fetch photos
    const patientPhotos = await PatientService.getPhotosByCpf(params.cpf);
    setPhotos(patientPhotos);
  }

  findPatient();
}, [params.cpf]);

  useEffect(() => {
    if (!recentAttendance?.responsavel) return;

    GuardianService.getByCpf(recentAttendance?.responsavel)
      .then((guardian) => setResponsavel(guardian || null))
      .catch(console.error);
  }, [recentAttendance?.responsavel]);

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

  const formatCPF = (value = "") => {
    const numbers = value.replace(/\D/g, "");

    return numbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  };

  const scoreHistory = attendances
    .filter((item) => item.score_do_paciente !== undefined && item.data_de_consulta)
    .map((item, index) => ({
      index,
      date: new Date(item.data_de_consulta).toLocaleDateString("pt-BR"),
      score: Number(item.score_do_paciente),
    }));

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title={patient.nome} subtitle={`CPF: ${patient.CPF_Paciente}`} />

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
                    router.push(`/pacientes/${params.cpf}/editar`)
                  }
                  className="px-5 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
                >
                  Editar
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
                <p className="text-lg font-semibold">{formatCPF(patient.CPF_Paciente)}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Sexo biológico</p>
                <p className="text-lg font-semibold">{patient.sexo || "-"}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-sm text-slate-500">Responsável atual</p>
                <p className="text-lg font-semibold">
                  {responsavel?.nome || "-"}
                </p>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-slate-500 mb-3">Foto do Paciente</p>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="relative w-full md:w-64 h-80 bg-slate-100 rounded-2xl overflow-hidden hover:opacity-90 transition cursor-pointer border-2 border-slate-200 hover:border-blue-400"
                >
                  {photos.find((p) => p.tipo_foto === "frente")?.caminho_foto ? (
                    <img
                      src={photos.find((p) => p.tipo_foto === "frente").caminho_foto}
                      alt="Foto frontal do paciente"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-slate-400">Foto não disponível</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 bg-opacity-0 hover:bg-opacity-20 transition">
                    <span className="text-white opacity-0 hover:opacity-100 text-sm font-semibold">
                      Clique para ver todas
                    </span>
                  </div>
                </button>
              </div>
            )}
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
                    recentAttendance?.score_do_paciente,
                  )}`}
                >
                  {recentAttendance?.score_do_paciente || 0}%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Classificação</p>
                <RiskBadge status={recentAttendance?.score_do_paciente <= 40 ? "Baixo Risco" : recentAttendance?.score_do_paciente <= 70 ? "Risco Moderado" : "Alto Risco"} />
                <p className="text-sm text-slate-500 mt-2">
                  <strong>
                    {
                      (recentAttendance?.score_do_paciente >= 56 && patient.sexo == "Masculino") ||
                      (recentAttendance?.score_do_paciente >= 55 && patient.sexo == "Feminino") ?
                      "Recomenda-se encaminhar para exame" : ""
                    }
                  </strong>
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(`/pacientes/${patient.CPF_Paciente}/resultado/${recentAttendance?.id_consulta}`)
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

            {attendances.length > 0 ? (
              <div className="space-y-6">
                {attendances.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <p className="text-sm text-slate-500">
                        {" "}
                        {item.data_de_consulta
                          ? new Date(item.data_de_consulta).toLocaleString("pt-BR")
                          : "Data não informada"}
                      </p>

                      <p className="text-sm text-slate-500">
                        CRM:{" "}
                        <span className="text-slate-700 font-medium">
                          {item.id_medico || "-"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 text-sm text-slate-600">
                      Responsável:{" "}
                      <strong className="text-slate-800">
                        {responsavel?.nome || "-"}
                      </strong>
                    </div>

                    {item.sintomas?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Sintomas
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.sintomas.split(', ').map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.score_do_paciente !== undefined && (
                      <p className="mt-4 font-bold text-slate-800">
                        Score: {item.score_do_paciente}%
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

      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photos={photos}
      />
    </main>
  );
}
