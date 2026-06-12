"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PatientService from "@/services/PatientService";
import GuardainService from "@/services/GuardianService";
import AttendanceService from "@/services/AttendanceService";

import SymptomChecklist from "@/components/SymptomChecklist";

export default function Atendimento() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [cpf, setCpf] = useState("");
  const [guardianCpf, setGuardianCpf] = useState("");
  const [crm, setCrm] = useState("");

  const [existingPatient, setExistingPatient] = useState(null);
  const [existingGuardian, setExistingGuardian] = useState(null);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [guardianFullName, setGuardianFullName] = useState("");
  const [guardianBirthDate, setGuardianBirthDate] = useState("");
  const [guardianSex, setGuardianSex] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [score, setScore] = useState(0);

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCRM = (value) => {
    return "CRM" + value.replace(/\D/g, "").slice(0, 5);
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");
  };

  const handleIdentify = async () => {
    if (!cpf || !crm) return;

    try {
      const patient = await PatientService.getByCpf(cpf);
      const guardian = await GuardainService.getByCpf(guardianCpf);

      setExistingPatient(patient || null);
      setExistingGuardian(guardian || null);

      if (patient) {
        setFullName(patient.nome || "");
        setBirthDate(patient.data_de_nascimento || "");
        setSex(patient.sexo || "");
      }

      if (guardian) {
        setGuardianFullName(guardian.nome || "");
        setGuardianBirthDate(guardian.data_de_nascimento || "");
        setGuardianSex(guardian.sexo || "");
        setGuardianPhone(guardian.telefone || "");
      }

      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Erro ao verificar paciente/responsável.");
    }
  };

  const handleSave = async () => {
    try {
      await AttendanceService.registerAttendance({
        crm,
        CPF_Paciente: cpf,
        nome_paciente: existingPatient?.nome || fullName,
        sexo_paciente: sex,
        data_de_nascimento_paciente: birthDate,
        foto_do_paciente: profilePic,
        CPF_Responsavel: guardianCpf,
        nome_responsavel: existingGuardian?.nome || guardianFullName,
        data_de_nascimento_responsavel: guardianBirthDate,
        sexo_responsavel: guardianSex,
        telefone: guardianPhone,
        sintomas: selectedSymptoms,
        score_risco: score,
      });

      router.push(`/pacientes/${cpf.replace(/\D/g, "")}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar atendimento.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-sm p-8 space-y-6">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-slate-800">Novo Atendimento</h1>

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

            <input
              placeholder="CPF do Responsável"
              value={guardianCpf}
              onChange={(e) => setGuardianCpf(formatCPF(e.target.value))}
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
                ✔ Paciente encontrado: <strong>{existingPatient.nome}</strong>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl">
                ⚠ Novo paciente será cadastrado
              </div>
            )}

            {guardianCpf ? (
              existingGuardian ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl">
                  ✔ Responsável encontrado: <strong>{existingGuardian.nome}</strong>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl">
                  ⚠ Novo responsável será cadastrado
                </div>
              )
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl">
                ⚠ Nenhum responsavel será registrado
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
                  placeholder="Nome completo do paciente"
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
                  <option value="">Selecione o sexo do paciente</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>

                <input
                  type="file"
                  onChange={(e) => setProfilePic(e.target.files[0] ?? null)}
                  accept="image/*"
                  className="
                    relative w-full h-32
                    bg-gray-100 border rounded-xl p-3
                    cursor-pointer text-sm text-gray-500 text-center
                    file:absolute file:top-2 file:right-2
                    file:rounded-md file:border-0
                    file:bg-gray-300 file:text-xs file:font-medium file:text-gray-700
                    file:px-3 file:py-1 file:cursor-pointer
                  "
                />
              </>
            )}

            <SymptomChecklist
              selectedSymptoms={selectedSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
              setScore={setScore}
              gender={sex}
            />

            {guardianCpf && !existingGuardian && (
              <>
                <input
                  placeholder="Nome completo do responsável"
                  value={guardianFullName}
                  onChange={(e) => setGuardianFullName(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  type="date"
                  value={guardianBirthDate}
                  onChange={(e) => setGuardianBirthDate(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  placeholder="Telefone do responsável"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(formatPhone(e.target.value))}
                  className="w-full p-3 border rounded-xl"
                />

                <select
                  value={guardianSex}
                  onChange={(e) => setGuardianSex(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="">Selecione o sexo do responsável</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </>
            )}

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