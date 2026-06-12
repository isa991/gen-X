const API_ENDPOINT = "http://127.0.0.1:8000/api";

import { authFetch } from "./authFetch";

async function getAll() {
  if (typeof window === "undefined") return [];

  try {
    const response = await authFetch(`${API_ENDPOINT}/get-pacientes/`);

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getByCpf(cpf) {
  const patients = await getAll();

  return patients.find(
    (p) => p.CPF_Paciente === String(cpf).replace(/\D/g, "")
  );
}

export default {
  getAll,
  getByCpf,
};