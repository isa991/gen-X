"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import SymptomChecklist from "@/components/SymptomChecklist";
import CPFInput from "@/components/CPFInput";

import { symptoms } from "@/mock/symptoms";
import PatientService from "@/services/PatientService";

export default function NovoPaciente() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [guardian, setGuardian] = useState("");
  const [sex, setSex] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    PatientService.create({
      cpf,
      fullName: name,
      guardian,
      sex,
      description,
      symptoms: selectedSymptoms,
      riskScore: 0,
      status: "Não Avaliado",
    });

    router.push("/pacientes");
  };

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header title="Novo Paciente" subtitle="Cadastro clínico do paciente" />

        <div className="p-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              <input
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded-xl w-full"
                required
              />

              <CPFInput value={cpf} onChange={setCpf} />

              <input
                placeholder="Responsável"
                value={guardian}
                onChange={(e) => setGuardian(e.target.value)}
                className="border p-3 rounded-xl w-full"
              />

              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="border p-3 rounded-xl w-full"
              >
                <option value="">Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>

              <SymptomChecklist
                symptoms={symptoms}
                selectedSymptoms={selectedSymptoms}
                setSelectedSymptoms={setSelectedSymptoms}
              />

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-3 rounded-xl w-full"
              />

              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Salvar
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
