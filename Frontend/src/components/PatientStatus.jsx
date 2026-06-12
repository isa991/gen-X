export default function PatientStatus({ status }) {
  const styles = {
    "Alto Risco": "bg-red-100 text-red-700",

    "Risco Moderado": "bg-amber-100 text-amber-700",

    "Baixo Risco": "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
