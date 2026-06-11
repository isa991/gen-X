"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        flex
        flex-col
        shrink-0
      "
    >
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-bold">GenX</h1>

        <nav className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/pacientes")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Pacientes
          </button>

          <button
            onClick={() => router.push("/relatorio")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Relatórios
          </button>

          <button
            onClick={() => router.push("/configuracoes")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Configurações
          </button>
        </nav>
      </div>

      <div className="flex-1" />

      <div className="p-6 border-t border-slate-800">
        <p className="text-sm text-slate-400">Médico responsável</p>
        <p className="font-semibold">Dr. João Silva</p>
        <p className="text-xs text-slate-400">CRM 123456</p>
      </div>
    </aside>
  );
}
