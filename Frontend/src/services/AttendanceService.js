const API_ENDPOINT = "http://127.0.0.1:8000/api";

import { authFetch } from "./authFetch";
import PatientService from "./PatientService";
import GuardainService from "./GuardianService";
import DoctorService from "./DoctorService";

async function postFormData(url, payload, errorLabel) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    // Skip null/undefined, but keep empty strings and 0
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await authFetch(url, {
    method: "POST",
    body: formData,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`${errorLabel}: ${JSON.stringify(body)}`);
  }

  return body;
}



async function getAll() {
  if (typeof window === "undefined") return [];

  try {
    const response = await authFetch(`${API_ENDPOINT}/get-historico-de-consulta/`);

    if (!response.ok) {
      throw new Error("Failed to fetch attendances");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getAllByCpf(cpf) {
  const attendances = await getAll();
  return attendances.filter((a) => a.paciente === cpf);
}

async function getByCpf(cpf) {
  const attendances = await getAllByCpf(cpf);

  const sortedAttendances = attendances.sort(
    (a, b) => new Date(b.data_de_consulta) - new Date(a.data_de_consulta)
  );

  return sortedAttendances[0];
}

async function getById(id) {
  const attendances = await getAll();
  return attendances.find((a) => a.id_consulta === parseInt(id));
}

async function postJson(url, payload, errorLabel) {
  const response = await authFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`${errorLabel}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function registerAttendance(data) {
  const patients = await PatientService.getAll();
  const guardians = await GuardainService.getAll();

  const cleanedPatientCpf = String(data.CPF_Paciente || "").replace(/\D/g, "");
  const cleanedGuardianCpf = String(data.CPF_Responsavel || "").replace(/\D/g, "");

  if (!cleanedPatientCpf) {
    throw new Error("CPF do paciente é obrigatório.");
  }

  const patientExists = patients.some(
    (p) => p.CPF_Paciente === cleanedPatientCpf
  );

  if (!patientExists) {
    const newPatient = {
      CPF_Paciente: cleanedPatientCpf,
      nome: data.nome_paciente || "",
      sexo: data.sexo_paciente || "",
      data_de_nascimento: data.data_de_nascimento_paciente || "",
      foto_do_paciente: data.foto_do_paciente || null,
    };

    await postFormData(
      `${API_ENDPOINT}/cadastro-paciente/`,
      newPatient,
      "Cadastro paciente error"
    );
  }

  const guardianExists =
    cleanedGuardianCpf &&
    guardians.some((g) => g.CPF_Responsavel === cleanedGuardianCpf);

  if (cleanedGuardianCpf && !guardianExists) {
    const newGuardian = {
      CPF_Responsavel: cleanedGuardianCpf,
      nome: data.nome_responsavel || "",
      sexo: data.sexo_responsavel || "",
      data_de_nascimento: data.data_de_nascimento_responsavel || "",
      telefone: data.telefone || "",
    };

    await postJson(
      `${API_ENDPOINT}/cadastro-responsavel/`,
      newGuardian,
      "Cadastro responsavel error"
    );
  }

  const doctor = await DoctorService.getByCrm(String(data.crm || "").replace(/\D/g, ""));

  const evaluation = {
    data_de_consulta: new Date().toISOString().slice(0, 10),
    medico: doctor.id_medico,
    paciente: cleanedPatientCpf,
    responsavel: cleanedGuardianCpf || null,
    sintomas: Array.isArray(data.sintomas) ? data.sintomas.join(", ") : "",
    score_risco: data.score_risco || 0,
  };

  await postJson(
    `${API_ENDPOINT}/adicionar-historico-de-consulta/`,
    evaluation,
    "Histórico de consulta error"
  );

  return evaluation;
}

export default {
  getAll,
  getAllByCpf,
  getByCpf,
  getById,
  registerAttendance,
};