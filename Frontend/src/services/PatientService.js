import { patients as mockPatients } from "@/mock/patients";

const STORAGE_KEY = "patients";

function getAll() {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  return JSON.parse(data);
}

function saveAll(patients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

function init() {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPatients));
  }
}

function getByCpf(cpf) {
  return getAll().find((p) => p.cpf === cpf);
}

/**
 * 🔥 NOVA FUNÇÃO PRINCIPAL: registrar atendimento
 */
function registerAttendance(cpf, data) {
  const patients = getAll();

  const index = patients.findIndex((p) => p.cpf === cpf);

  const evaluation = {
    date: new Date().toISOString(),
    crm: data.crm,
    guardian: data.guardian || "",
    symptoms: data.symptoms || [],
    description: data.description || "",
    riskScore: data.riskScore || 0,
    status: data.status || "Não Avaliado",
  };

  // 🟢 CASO 1: paciente já existe → adiciona histórico
  if (index !== -1) {
    patients[index].evaluations = [
      ...(patients[index].evaluations || []),
      evaluation,
    ];

    patients[index].symptoms = data.symptoms || patients[index].symptoms;
    patients[index].riskScore = data.riskScore;
    patients[index].status = data.status;

    saveAll(patients);
    return;
  }

  // 🟡 CASO 2: novo paciente
  const newPatient = {
    cpf,
    fullName: data.fullName,
    sex: data.sex || "",
    symptoms: data.symptoms || [],
    evaluations: [evaluation],
    riskScore: data.riskScore,
    status: data.status,
  };

  patients.push(newPatient);
  saveAll(patients);
}

export default {
  init,
  getAll,
  getByCpf,
  registerAttendance,
};
