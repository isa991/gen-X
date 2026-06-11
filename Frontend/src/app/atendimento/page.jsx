"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PatientService from "@/services/PatientService";

const SYMPTOMS_LIST = [
  "Déficit intelectual",
  "Atraso de fala",
  "TEA",
  "Ansiedade social",
  "Hiperatividade",
  "Face alongada",
  "Orelhas proeminentes",
  "Palato alto",
  "Histórico familiar",
  "Dificuldades de aprendizagem",
  "Contato visual reduzido",
  "Atraso motor",
];

export default function Atendimento() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [cpf, setCpf] = useState("");
  const [crm, setCrm] = useState("");

  const [existingPatient, setExistingPatient] = useState(null);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");

  const [guardian, setGuardian] = useState("");
  const [relationship, setRelationship] = useState("");

  const [description, setDescription] = useState("");

  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    PatientService.init();
  }, []);

  // =========================
  // MÁSCARAS
  // =========================

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCRM = (value) => {
    return value.replace(/\D/g, "").slice(0, 6);
  };

  const handleIdentify = () => {
    if (!cpf || !crm) return;

    const patient = PatientService.getByCpf(cpf);
    setExistingPatient(patient || null);

    setStep(2);
  };

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleSave = () => {
    PatientService.registerAttendance(cpf, {
      crm,
      fullName: existingPatient ? existingPatient.fullName : fullName,
      sex,
      birthDate,
      guardian,
      relationship,
      symptoms,
      description,
      riskScore: 0,
      status: "Não Avaliado",
    });

    router.push(`/pacientes/${cpf}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-sm p-8 space-y-6">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-slate-800">
              Novo Atendimento
            </h1>

            <input
              placeholder="CRM do médico"
              value={crm}
              onChange={(e) => setCrm(formatCRM(e.target.value))}
              className="w-full p-3 border rounded-xl"
            />

            <input
              placeholder="CPF do paciente"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              className="w-full p-3 border rounded-xl"
            />

            <button
              onClick={handleIdentify}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              Continuar
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-xl font-bold text-slate-800">
              Verificação do paciente
            </h1>

            {existingPatient ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl">
                ✔ Paciente encontrado:{" "}
                <strong>{existingPatient.fullName}</strong>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl">
                ⚠ Novo paciente será cadastrado
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              Prosseguir
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-xl font-bold text-slate-800">
              Dados do atendimento
            </h1>

            {!existingPatient && (
              <>
                <input
                  placeholder="Nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />

                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="">Selecione o sexo</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </>
            )}

            <input
              placeholder="Responsável"
              value={guardian}
              onChange={(e) => setGuardian(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Grau de parentesco</option>
              <option value="Pai">Pai</option>
              <option value="Mãe">Mãe</option>
              <option value="Irmão">Irmão</option>
              <option value="Irmã">Irmã</option>
              <option value="Tia">Tia</option>
              <option value="Tio">Tio</option>
              <option value="Avô">Avô</option>
              <option value="Avó">Avó</option>
              <option value="Outro">Outro</option>
            </select>

            <div className="border rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
              {SYMPTOMS_LIST.map((symptom) => (
                <label key={symptom} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                  />
                  <span className="text-slate-700">{symptom}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Descrição da avaliação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl min-h-[120px]"
            />

            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-3 rounded-xl"
            >
              Salvar Atendimento
            </button>
          </>
        )}
      </div>
    </main>
  );
}
