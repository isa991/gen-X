export default function Header({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-6">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>

      <p className="text-slate-500 mt-2">{subtitle}</p>
    </header>
  );
}
