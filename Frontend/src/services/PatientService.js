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

async function getPhotosByCpf(cpf) {
  if (typeof window === "undefined") return [];

  try {
    const cleanCpf = String(cpf).replace(/\D/g, "");
    const response = await authFetch(`${API_ENDPOINT}/get-fotos-paciente/?cpf=${cleanCpf}`);

    if (!response.ok) {
      throw new Error("Failed to fetch patient photos");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function updatePatient(cpf, patientData) {
  const cleanCpf = String(cpf).replace(/\D/g, "");

  try {
    const response = await authFetch(`${API_ENDPOINT}/atualizar-paciente/${cleanCpf}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error("Failed to update patient");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updatePhoto(photoId, photoData) {
  try {
    const formData = new FormData();
    
    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await authFetch(`${API_ENDPOINT}/atualizar-foto-paciente/${photoId}/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update photo");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function addPhoto(cpf, photoData) {
  const cleanCpf = String(cpf).replace(/\D/g, "");

  try {
    const formData = new FormData();
    
    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await authFetch(`${API_ENDPOINT}/adicionar-foto-paciente/${cleanCpf}/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add photo");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  getAll,
  getByCpf,
  getPhotosByCpf,
  updatePatient,
  updatePhoto,
  addPhoto,
};