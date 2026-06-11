"use client";

export default function SymptomChecklist({
  symptoms,
  selectedSymptoms,
  setSelectedSymptoms,
}) {
  const handleChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {symptoms.map((symptom) => (
        <label
          key={symptom}
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
            checked={selectedSymptoms.includes(symptom)}
            onChange={() => handleChange(symptom)}
            className="
              w-4
              h-4
              accent-blue-600
              cursor-pointer
            "
          />

          <span className="text-slate-800 font-medium">{symptom}</span>
        </label>
      ))}
    </div>
  );
}
