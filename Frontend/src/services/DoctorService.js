const API_ENDPOINT = "http://127.0.0.1:8000/api";

import { authFetch } from "./authFetch";

async function getAll() {
  if (typeof window === "undefined") return [];

  try {
    const response = await authFetch(`${API_ENDPOINT}/get-all-medicos/`);

    if (!response.ok) {
      throw new Error("Failed to fetch guardians");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getByCrm(crm) {
  const response = await authFetch(`${API_ENDPOINT}/medico/?crm=${crm}`);
   if (!response.ok) {
    throw new Error(`Doctor not found for CRM: ${crm}`);
  }
  return await response.json();
}

async function searchByCrm(crm) {
  if (!crm) {
    return null;
  }

  try {
    const response = await authFetch(`${API_ENDPOINT}/medico-with-user/?crm=${crm}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function toggleStatus(medicoId) {
  try {
    const response = await authFetch(`${API_ENDPOINT}/medico/${medicoId}/toggle-status/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to toggle doctor status");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateCredentials(medicoId, updates) {
  try {
    const response = await authFetch(`${API_ENDPOINT}/medico/${medicoId}/update-credentials/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update doctor credentials");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createDoctor(doctorData) {
  try {
    const response = await authFetch(`${API_ENDPOINT}/admin/register-medico/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || JSON.stringify(error) || "Failed to create doctor");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  getAll,
  getByCrm,
  searchByCrm,
  toggleStatus,
  updateCredentials,
  createDoctor,
};