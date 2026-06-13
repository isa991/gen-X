"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import CPFInput from "@/components/CPFInput";

import PatientService from "@/services/PatientService";

export default function EditPatient() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [originalCpf, setOriginalCpf] = useState("");

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [status, setStatus] = useState(true);

  const [photos, setPhotos] = useState({
    frente: null,
    esquerdo: null,
    direito: null,
  });

  const [existingPhotos, setExistingPhotos] = useState({});
  const [photoFiles, setPhotoFiles] = useState({
    frente: null,
    esquerdo: null,
    direito: null,
  });

  useEffect(() => {
    async function getInfo() {
      try {
        const patient = await PatientService.getByCpf(params.cpf);

        if (patient) {
          setOriginalCpf(patient.CPF_Paciente);
          setName(patient.nome || "");
          setCpf(patient.CPF_Paciente || "");
          setSex(patient.sexo || "");
          setBirthDate(patient.data_de_nascimento || "");
          setStatus(patient.status !== false);

          // Fetch and organize photos
          const patientPhotos = await PatientService.getPhotosByCpf(patient.CPF_Paciente);
          const photoMap = {};
          patientPhotos.forEach((photo) => {
            photoMap[photo.tipo_foto] = photo;
          });
          setExistingPhotos(photoMap);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading patient:", error);
        setLoading(false);
      }
    }
    getInfo();
  }, [params.cpf]);

  const handlePhotoChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFiles((prev) => ({
        ...prev,
        [type]: file,
      }));
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const allPatients = await PatientService.getAll();

      const duplicatedCpf = allPatients.find(
        (p) => p.CPF_Paciente === cpf && p.CPF_Paciente !== originalCpf
      );

      if (duplicatedCpf) {
        alert("Já existe um paciente cadastrado com este CPF.");
        setSaving(false);
        return;
      }

      // Update patient info
      const updatedPatient = {
        nome: name,
        sexo: sex,
        data_de_nascimento: birthDate,
        status: status,
      };

      await PatientService.updatePatient(originalCpf, updatedPatient);

      // Handle photo updates
      const photoPromises = [];

      // Update existing photos or add new ones
      Object.entries(photoFiles).forEach(([type, file]) => {
        if (file) {
          const formData = new FormData();
          formData.append("tipo_foto", type);
          formData.append("caminho_foto", file);
          formData.append("paciente", cpf);

          if (existingPhotos[type]) {
            // Update existing photo
            photoPromises.push(
              PatientService.updatePhoto(existingPhotos[type].id_foto, {
                tipo_foto: type,
                caminho_foto: file,
              })
            );
          } else {
            // Add new photo
            photoPromises.push(PatientService.addPhoto(cpf, {
              tipo_foto: type,
              caminho_foto: file,
            }));
          }
        }
      });

      await Promise.all(photoPromises);

      alert("Paciente atualizado com sucesso!");
      router.push(`/pacientes/${cpf}`);
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Erro ao atualizar paciente: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Carregando...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Editar Paciente"
          subtitle="Atualização da ficha clínica"
        />

        <div className="p-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Informações Básicas
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="border border-slate-300 rounded-xl p-3 text-slate-800"
                    required
                  />

                  <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 flex items-center">
                    <span className="font-medium">CPF: {cpf}</span>
                    <span className="text-xs text-slate-500 ml-2">(não pode ser alterado)</span>
                  </div>

                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="border border-slate-300 rounded-xl p-3 text-slate-800"
                  >
                    <option value="">Selecione o Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>

                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="Data de Nascimento"
                    className="border border-slate-300 rounded-xl p-3 text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Status Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Status do Paciente
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-slate-700">
                      {status ? "Paciente Ativo" : "Paciente Inativo"}
                    </span>
                  </label>
                  {!status && (
                    <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      ⚠️ Pacientes inativos não podem ter novos atendimentos
                    </div>
                  )}
                </div>
              </div>

              {/* Photos Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Fotos do Paciente
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {["frente", "esquerdo", "direito"].map((type) => (
                    <div key={type} className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-slate-700 capitalize">
                        Foto {type === "frente" ? "Frontal" : type === "esquerdo" ? "Lado Esquerdo" : "Lado Direito"}
                      </label>
                      
                      {/* Preview */}
                      <div className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden">
                        {photos[type] ? (
                          <img
                            src={photos[type]}
                            alt={`Foto ${type}`}
                            className="w-full h-full object-cover"
                          />
                        ) : existingPhotos[type]?.caminho_foto ? (
                          <img
                            src={existingPhotos[type].caminho_foto}
                            alt={`Foto ${type}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-400 text-center text-sm px-4">
                            Sem foto
                          </span>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, type)}
                        className="border border-slate-300 rounded-xl p-2 text-sm text-slate-600 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
