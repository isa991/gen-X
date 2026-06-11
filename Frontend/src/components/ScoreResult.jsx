export default function ScoreResult({ score, status }) {
  const recommendations = {
    "Alto Risco":
      "O paciente apresenta alta probabilidade de associação com a Síndrome do X-Frágil. Recomenda-se encaminhamento para avaliação genética especializada e realização de exame molecular confirmatório.",

    "Risco Moderado":
      "O paciente apresenta sinais clínicos relevantes. Sugere-se investigação complementar e acompanhamento especializado.",

    "Baixo Risco":
      "Não há indicativos suficientes para recomendação imediata de exame confirmatório. Recomenda-se acompanhamento clínico conforme necessidade.",

    "Não Avaliado": "O paciente ainda não possui avaliação registrada.",
  };

  const colors = {
    "Alto Risco": "bg-red-50 border-red-200 text-red-700",

    "Risco Moderado": "bg-amber-50 border-amber-200 text-amber-700",

    "Baixo Risco": "bg-green-50 border-green-200 text-green-700",

    "Não Avaliado": "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-slate-600 mb-2">Score Calculado</p>

        <h2 className="text-6xl font-bold text-blue-600">{score}%</h2>
      </div>

      <div
        className={`border rounded-2xl p-6 ${
          colors[status] || colors["Não Avaliado"]
        }`}
      >
        <h3 className="font-semibold text-lg mb-3">{status}</h3>

        <p>{recommendations[status]}</p>
      </div>
    </div>
  );
}
