export default function StatisticsCard({
  title,
  value,
  color = "text-blue-600",
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <p className="text-slate-500">{title}</p>

      <h2 className={`text-4xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}
