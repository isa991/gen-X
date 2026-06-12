import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <section className="max-w-7xl mx-auto min-h-screen flex flex-col justify-center px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <Image
                src="/genX_logo.png"
                alt="GenX"
                width={180}
                height={180}
                priority
              />
            </div>

            <h1 className="text-5xl font-bold text-slate-800 leading-tight">
              GenX
            </h1>

            <h2 className="text-2xl text-blue-700 font-semibold mt-4">
              Sistema de apoio à triagem clínica para Síndrome do X-Frágil
            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-relaxed max-w-2xl">
              Plataforma desenvolvida para auxiliar profissionais da saúde na
              avaliação de pacientes com suspeita de Síndrome do X-Frágil,
              utilizando análise estruturada de sinais clínicos e cálculo
              automatizado de score de risco.
            </p>

            <div className="mt-10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Cadastro de Pacientes
              </h3>

              <p className="text-slate-600">
                Registre informações clínicas, responsáveis, histórico de
                atendimento e demais dados relevantes para acompanhamento.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Avaliação Clínica Estruturada
              </h3>

              <p className="text-slate-600">
                Utilize um checklist padronizado de sintomas associados à
                Síndrome do X-Frágil para apoiar o processo de triagem.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Cálculo de Score
              </h3>

              <p className="text-slate-600">
                Obtenha automaticamente uma estimativa de risco baseada nas
                características clínicas observadas durante o atendimento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
