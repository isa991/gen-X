const symptomWeights = {
  "Déficit intelectual": 15,
  "Atraso de fala": 12,
  "Transtorno do Espectro Autista": 18,
  "Ansiedade social": 8,
  Hiperatividade: 6,
  "Face alongada": 8,
  "Orelhas proeminentes": 8,
  "Palato alto": 5,
  "Histórico familiar": 20,
  "Dificuldades de aprendizagem": 10,
  "Contato visual reduzido": 5,
  "Atraso no desenvolvimento motor": 10,
};

export function calculateScore(symptoms) {
  if (!Array.isArray(symptoms)) return 0;

  let score = 0;

  symptoms.forEach((symptom) => {
    const normalized = typeof symptom === "string" ? symptom.trim() : "";
    score += symptomWeights[normalized] || 0;
  });

  if (!Number.isFinite(score)) return 0;

  return Math.min(score, 100);
}

export function determineRisk(score) {
  const value = Number(score);

  if (!Number.isFinite(value)) return "Baixo Risco";

  if (value >= 70) return "Alto Risco";
  if (value >= 40) return "Risco Moderado";
  return "Baixo Risco";
}
