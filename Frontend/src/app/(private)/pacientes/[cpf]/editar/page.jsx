"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import CPFInput from "@/components/CPFInput";
import SymptomChecklist from "@/components/SymptomChecklist";

import { symptoms } from "@/mock/symptoms";

import PatientService from "@/services/PatientService";
import { calculateScore } from "@/utils/calculateScore";

export default function EditPatient() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [originalCpf, setOriginalCpf] = useState("");

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [sex, setSex] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  useEffect(() => {
    async function getInfo() {
      const patient = PatientService.getByCpf(params.cpf);

      if (patient) {
        setOriginalCpf(patient.CPF_Paciente);

        setName(patient.nome || "");
        setCpf(patient.CPF_Paciente || "");
        setSex(patient.sexo || "");

        setSelectedSymptoms(patient.symptoms || []);
      }

      setLoading(false);
    }
    getInfo();
  }, [params.cpf]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allPatients = await PatientService.getAll();

    const duplicatedCpf = allPatients.find(
      (p) => p.CPF_Paciente === cpf && p.CPF_Paciente !== originalCpf,
    );

    if (duplicatedCpf) {
      alert("Já existe um paciente cadastrado com este CPF.");
      return;
    }

    const score = calculateScore(selectedSymptoms);

    const originalPatient = await PatientService.getByCpf(originalCpf);

    const updatedPatient = {
      ...originalPatient,
      nome: name,
      CPF_Paciente: cpf,
      sexo: sex,
    };

    PatientService.update(originalCpf, updatedPatient);

    router.push(`/pacientes/${updatedPatient.cpf}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Carregando...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Editar Paciente"
          subtitle="Atualização da ficha clínica"
        />

        <div className="p-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-1 gap-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="border border-slate-300 rounded-xl p-3 text-slate-800"
                  required
                />

                <CPFInput
                  value={cpf}
                  onChange={setCpf}
                  className="border border-slate-300 rounded-xl p-3"
                />

                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="border border-slate-300 rounded-xl p-3 text-slate-800"
                >
                  <option value="">Sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
