"use client";

const API_ENDPOINT = "http://127.0.0.1:8000/api";

import { useEffect, useState } from "react";

import { authFetch } from "@/services/authFetch";

export default function SymptomChecklist({
  selectedSymptoms,
  setSelectedSymptoms,
  setScore,
  gender,
}) {
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const getSymptoms = async () => {
      try {
        const response = await authFetch(`${API_ENDPOINT}/sintomas`);

        if (!response.ok) {
          throw new Error("Failed to fetch symptoms");
        }

        const data = await response.json();
        setSymptoms(data);
      } catch (error) {
        console.error(error);
      }
    };

    getSymptoms();
  }, []);

  useEffect(() => {
    const total = symptoms.reduce((acc, symptom) => {
      if (!selectedSymptoms.includes(symptom.sintoma)) {
        return acc;
      }

      if (gender === "Masculino") {
        return acc + Number(symptom.peso_masc || 0);
      }

      if (gender === "Feminino") {
        return acc + Number(symptom.peso_fem || 0);
      }

      return acc;
    }, 0);

    setScore(total);
  }, [selectedSymptoms, symptoms, gender, setScore]);

  const handleChange = (symptomName) => {
    setSelectedSymptoms((current) =>
      current.includes(symptomName)
        ? current.filter((item) => item !== symptomName)
        : [...current, symptomName]
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {symptoms.map((symptom) => (
        <label
          key={symptom.id_sintoma}
          className="
            border
            border-slate-200
            rounded-xl
            p-4
            flex
            items-center
            gap-3
            cursor-pointer
            transition
            hover:bg-slate-50
          "
        >
          <input
            type="checkbox"
            checked={selectedSymptoms.includes(symptom.sintoma)}
            onChange={() => handleChange(symptom.sintoma)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />

          <span className="text-slate-800 font-medium">{symptom.sintoma}</span>
        </label>
      ))}
    </div>
  );
}