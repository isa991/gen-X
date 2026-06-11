export default function RiskBadge({ status }) {
  const colorMap = {
    "Alto Risco": "bg-red-100 text-red-700",
    "Risco Moderado": "bg-amber-100 text-amber-700",
    "Baixo Risco": "bg-green-100 text-green-700",
    "Não Avaliado": "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`px-4 py-2 rounded-full font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
}
