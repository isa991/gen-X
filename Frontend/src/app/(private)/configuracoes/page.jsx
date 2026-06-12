"use client";

import Header from "@/components/Header";

export default function Configuracoes() {
  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="flex-1">
        <Header
          title="Configurações"
          subtitle="Gerencie suas informações e preferências."
        />

        <div className="p-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Dados do Médico
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue="Nome do Médico"
                  className="w-full border border-slate-300 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CRM
                </label>
                <input
                  type="text"
                  defaultValue="CRM 000000"
                  className="w-full border border-slate-300 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  defaultValue="medico@hospital.com"
                  className="w-full border border-slate-300 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Especialidade
                </label>
                <input
                  type="text"
                  defaultValue="Genética Médica"
                  className="w-full border border-slate-300 rounded-xl p-3 text-slate-800"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Segurança
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="password"
                placeholder="Nova senha"
                className="border border-slate-300 rounded-xl p-3"
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                className="border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Atualizar Senha
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Sobre o Sistema
            </h2>

            <div className="space-y-3 text-slate-700">
              <p>
                <strong>GenX</strong> é uma plataforma de apoio ao rastreamento
                clínico da Síndrome do X-Frágil.
              </p>
              <p>Versão: 1.0.0</p>
              <p>Front-end: React + Next.js</p>
              <p>Back-end: Django</p>
              <p>Banco de Dados: MySQL</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
