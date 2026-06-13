"use client";

import Header from "@/components/Header";
import DoctorService from "@/services/DoctorService";
import { useEffect, useState, useRef } from "react";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("search"); // "search" or "create"
  const [crm, setCrm] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state for credential updates
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Form state for creating new doctor
  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    crm: "",
    password: "",
    password2: "",
  });

  const debounceTimer = useRef(null);

  // Load all doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const doctors = await DoctorService.getAll();
        setAllDoctors(doctors || []);
        setFilteredDoctors(doctors || []);
      } catch (err) {
        setError("Failed to load doctors: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const formatCRM = (value) => {
    return value.replace(/\D/g, "").slice(0, 6);
  };

  const isValidUsername = (username) => {
    // Django allows: letters, numbers, @, ., +, -, _
    // No spaces or other special characters
    const validPattern = /^[a-zA-Z0-9@.+_-]*$/;
    return validPattern.test(username);
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleCrmChange = (e) => {
    const formattedCrm = formatCRM(e.target.value);
    setCrm(formattedCrm);

    clearMessages();
    setSelectedDoctor(null);

    // Filter doctors by CRM (partial match or exact match)
    if (formattedCrm.length > 0) {
      const filtered = allDoctors.filter((doctor) =>
        doctor.crm.includes(formattedCrm)
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(allDoctors);
    }
  };

  const handleSelectDoctorFromList = async (doctor) => {
    try {
      // Fetch full doctor data with user info
      const fullDoctor = await DoctorService.searchByCrm(doctor.crm);
      if (fullDoctor) {
        setSelectedDoctor(fullDoctor);
        setFormData({
          username: fullDoctor.username || "",
          email: fullDoctor.email || "",
          password: "",
          passwordConfirm: "",
        });
      }
    } catch (err) {
      setError("Error loading doctor details: " + err.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    // Only format CRM field, allow all characters for other fields
    const newValue = name === "crm" ? formatCRM(value) : value;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleToggleStatus = async () => {
    if (!selectedDoctor) return;

    try {
      setIsUpdating(true);
      clearMessages();
      const result = await DoctorService.toggleStatus(selectedDoctor.id_medico);

      setSelectedDoctor((prev) => ({
        ...prev,
        is_active: result.is_active,
      }));

      setSuccessMessage(result.message);
    } catch (err) {
      setError("Error updating doctor status: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) return;

    // Validate password match if password is provided
    if (formData.password && formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      clearMessages();

      const updates = {};
      if (formData.username && formData.username !== selectedDoctor.username) {
        updates.username = formData.username;
      }
      if (formData.email && formData.email !== selectedDoctor.email) {
        updates.email = formData.email;
      }
      if (formData.password) {
        updates.password = formData.password;
      }

      if (Object.keys(updates).length === 0) {
        setError("No changes to save.");
        return;
      }

      const result = await DoctorService.updateCredentials(
        selectedDoctor.id_medico,
        updates
      );

      setSelectedDoctor((prev) => ({
        ...prev,
        username: result.username,
        email: result.email,
      }));

      setFormData({
        username: result.username,
        email: result.email,
        password: "",
        passwordConfirm: "",
      });

      setSuccessMessage(result.message);
    } catch (err) {
      setError("Error updating credentials: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    clearMessages();

    // Validation
    if (!createFormData.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!isValidUsername(createFormData.username)) {
      setError("Username contains invalid characters. Allowed: letters, numbers, @, ., +, -, _");
      return;
    }
    if (!createFormData.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!createFormData.crm || createFormData.crm.length !== 6) {
      setError("CRM must be 6 digits.");
      return;
    }
    if (!createFormData.password) {
      setError("Password is required.");
      return;
    }
    if (createFormData.password !== createFormData.password2) {
      setError("Passwords do not match.");
      return;
    }
    if (createFormData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsUpdating(true);
      const result = await DoctorService.createDoctor({
        username: createFormData.username,
        email: createFormData.email,
        crm: createFormData.crm,
        password: createFormData.password,
        password2: createFormData.password2,
      });

      setSuccessMessage(
        `Doctor "${result.user.username}" created successfully! CRM: ${result.medico.crm}`
      );

      // Reset form
      setCreateFormData({
        username: "",
        email: "",
        crm: "",
        password: "",
        password2: "",
      });
    } catch (err) {
      const errorMsg = err.message;
      if (errorMsg.includes("username")) {
        setError("Username already exists.");
      } else if (errorMsg.includes("email")) {
        setError("Email already exists.");
      } else {
        setError("Error creating doctor: " + errorMsg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
        <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Configurações"
          subtitle="Gerencie as informações e preferências do servidor."
        />

        <div className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              {successMessage}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex gap-4 border-b border-slate-200">
              <button
                onClick={() => {
                  setActiveTab("search");
                  clearMessages();
                }}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === "search"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-800"
                }`}
              >
                Buscar e Editar
              </button>
              <button
                onClick={() => {
                  setActiveTab("create");
                  clearMessages();
                }}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === "create"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-800"
                }`}
              >
                Criar Novo Médico
              </button>
            </div>
          </div>

          {activeTab === "search" && (
            <>
              {/* Search Section */}
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Buscar médico
                </h2>

                <p className="text-sm text-slate-500 mb-4">
                  Digite o <strong>CRM do médico</strong> para filtrar a lista
                </p>

                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      placeholder="CRM do médico (6 dígitos)"
                      value={crm}
                      onChange={handleCrmChange}
                      maxLength="6"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {!loading && (
                <div className="bg-white rounded-3xl shadow-sm p-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Médicos ({filteredDoctors.length})
                  </h2>

                  {filteredDoctors.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.id_medico}
                          onClick={() => handleSelectDoctorFromList(doctor)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedDoctor?.id_medico === doctor.id_medico
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-slate-900">
                                  CRM: {doctor.crm}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    doctor.is_active
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {doctor.is_active ? "Ativo" : "Inativo"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">
                                Email: {doctor.email_medico}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      {crm
                        ? "Nenhum médico encontrado com esse CRM."
                        : "Nenhum médico no sistema."}
                    </p>
                  )}
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
                  <p className="text-slate-500">Carregando médicos...</p>
                </div>
              )}

              {selectedDoctor && (
                <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">
                      Dados do Médico
                    </h2>

                    {/* Doctor Info Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">
                          CRM:
                        </span>
                        <span className="text-slate-900 font-semibold">
                          {selectedDoctor.crm}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">
                          Nome de Usuário:
                        </span>
                        <span className="text-slate-900">
                          {selectedDoctor.username}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">
                          Email:
                        </span>
                        <span className="text-slate-900">{selectedDoctor.email}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-300">
                        <span className="text-sm font-medium text-slate-700">
                          Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedDoctor.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedDoctor.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Status Button */}
                    <div className="flex justify-end mb-6">
                      <button
                        onClick={handleToggleStatus}
                        disabled={isUpdating}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                          selectedDoctor.is_active
                            ? "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400"
                            : "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
                        }`}
                      >
                        {isUpdating
                          ? "Atualizando..."
                          : selectedDoctor.is_active
                          ? "Desativar Médico"
                          : "Ativar Médico"}
                      </button>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <form onSubmit={handleSaveCredentials} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Editar Credenciais
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nome de Usuário
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Institucional
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nova Senha (opcional)
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            placeholder="Deixe em branco para não alterar"
                            className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirmar Senha
                          </label>
                          <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleFormChange}
                            placeholder="Confirme a nova senha"
                            className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(null);
                          setCrm("");
                          setFormData({
                            username: "",
                            email: "",
                            password: "",
                            passwordConfirm: "",
                          });
                        }}
                        disabled={isUpdating}
                        className="px-6 py-3 border border-slate-300 text-slate-800 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:bg-blue-400"
                      >
                        {isUpdating ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

          {activeTab === "create" && (
            <>
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Criar Novo Médico
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Preencha os dados para registrar um novo médico no sistema.
              </p>

              <form onSubmit={handleCreateDoctor} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome de Usuário *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={createFormData.username}
                      onChange={handleCreateFormChange}
                      placeholder="Ex: dr_silva"
                      className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Institucional *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createFormData.email}
                      onChange={handleCreateFormChange}
                      placeholder="Ex: silva@hospital.com"
                      className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CRM *
                    </label>
                    <input
                      type="text"
                      name="crm"
                      value={createFormData.crm}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          crm: formatCRM(e.target.value),
                        }))
                      }
                      placeholder="000000"
                      maxLength="6"
                      className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2"></div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={createFormData.password}
                      onChange={handleCreateFormChange}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      name="password2"
                      value={createFormData.password2}
                      onChange={handleCreateFormChange}
                      placeholder="Confirme a senha"
                      className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setCreateFormData({
                        username: "",
                        email: "",
                        crm: "",
                        password: "",
                        password2: "",
                      })
                    }
                    disabled={isUpdating}
                    className="px-6 py-3 border border-slate-300 text-slate-800 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                  >
                    Limpar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl disabled:bg-green-400"
                  >
                    {isUpdating ? "Criando..." : "Criar Médico"}
                  </button>
                </div>
              </form>
            </div>
            </>
          )}

          {/* System Info */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Sobre o Sistema
            </h2>

            <div className="space-y-3 text-slate-700">
              <p>
                <strong>GenX</strong> é uma plataforma de apoio ao rastreamento
                clínico da Síndrome do X-Frágil.
              </p>
              <p>Versão: 1.0.0</p>
              <p>Front-end: React + Next.js</p>
              <p>Back-end: Django</p>
              <p>Banco de Dados: MySQL</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
