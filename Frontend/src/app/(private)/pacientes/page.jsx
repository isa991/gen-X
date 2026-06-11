"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import CPFInput from "@/components/CPFInput";
import RiskBadge from "@/components/RiskBadge";

import PatientService from "@/services/PatientService";

export default function Pacientes() {
  const router = useRouter();

  const [cpfSearch, setCpfSearch] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setPatients(PatientService.getAll());
  }, []);

  const handleSearch = () => {
    if (!cpfSearch.trim()) return;
    router.push(`/pacientes/${cpfSearch}`);
  };

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title="Pacientes" subtitle="Cadastro e consulta de pacientes" />

        <div className="p-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Gerenciar atendimentos
              </h2>
              <p className="text-slate-500 text-sm">
                Inicie um novo atendimento ou consulte pacientes existentes
              </p>
            </div>

            <button
              onClick={() => router.push("/atendimento")}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              + Novo Atendimento
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Buscar paciente
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              Digite o <strong>CPF do paciente</strong> para localizar o
              cadastro
            </p>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <CPFInput value={cpfSearch} onChange={setCpfSearch} />
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Lista de Pacientes
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3 text-slate-700">Nome</th>
                    <th className="p-3 text-slate-700">CPF</th>
                    <th className="p-3 text-slate-700">Score</th>
                    <th className="p-3 text-slate-700">Status</th>
                    <th className="p-3 text-slate-700">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.cpf}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3 text-slate-800">{patient.fullName}</td>

                      <td className="p-3 text-slate-800">{patient.cpf}</td>

                      <td className="p-3 text-slate-800">
                        {patient.riskScore || 0}%
                      </td>

                      <td className="p-3">
                        <RiskBadge status={patient.status} />
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() =>
                            router.push(`/pacientes/${patient.cpf}`)
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
