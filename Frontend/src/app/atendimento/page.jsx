"use client";

import { useState, useEffect } from "react";
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
  const [leftSidePic, setLeftSidePic] = useState("");
  const [rightSidePic, setRightSidePic] = useState("");

  const [guardianFullName, setGuardianFullName] = useState("");
  const [guardianBirthDate, setGuardianBirthDate] = useState("");
  const [guardianSex, setGuardianSex] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (step === 3 && existingPatient?.status === false) {
      router.push("/pacientes/");
    }
  }, [step, existingPatient, router]);

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
        setRelationship(guardian.grau_de_parentesco || "");
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
        foto_de_frente_do_paciente: profilePic,
        foto_do_lado_esquerdo_do_paciente: leftSidePic,
        foto_do_lado_direito_do_paciente: rightSidePic,
        CPF_Responsavel: guardianCpf,
        nome_responsavel: existingGuardian?.nome || guardianFullName,
        data_de_nascimento_responsavel: guardianBirthDate,
        sexo_responsavel: guardianSex,
        telefone: guardianPhone,
        grau_de_parentesco: relationship,
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
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

            {existingPatient ? existingPatient.status === false ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                ❌ Paciente encontrado, mas está inativo. Por favor, reative o paciente na aba de edição para prosseguir.
              </div>
            ) : (
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
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
                  <option value="">Selecione o sexo biológico do paciente</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>

                <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-500 text-center">
                  <p className="text-center text-gray-700">Foto de frente</p>
                  <p className="text-center text-gray-700">Foto do lado esquerdo</p>
                  <p className="text-center text-gray-700">Foto do lado direito</p>

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
                  <input
                    type="file"
                    onChange={(e) => setLeftSidePic(e.target.files[0] ?? null)}
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
                  <input
                    type="file"
                    onChange={(e) => setRightSidePic(e.target.files[0] ?? null)}
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
                </div>
              </>
            )}

            {existingPatient?.status === true && (
              <SymptomChecklist
                selectedSymptoms={selectedSymptoms}
                setSelectedSymptoms={setSelectedSymptoms}
                setScore={setScore}
                gender={sex}
              />
            )}

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
              </>
            )}

            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
            >
              Salvar Atendimento
            </button>
          </>
        )}
      </div>
    </main>
  );
}