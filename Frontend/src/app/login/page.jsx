"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    login(email);

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <div className="flex justify-center mb-8">
            <Image
              src="/genX_logo.png"
              alt="GenX"
              width={130}
              height={130}
              priority
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-800">
            Acesso à Plataforma
          </h1>

          <p className="text-center text-slate-500 mt-3 mb-8">
            Entre com suas credenciais para acessar o sistema.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail institucional
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@instituicao.com"
                className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Plataforma destinada a profissionais da saúde autorizados.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
