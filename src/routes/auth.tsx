import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "../assets/carvalhos-cell-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Painel Carvalho's Cell" },
      { name: "description", content: "Acesso restrito ao painel de produtos da Carvalho's Cell." },
      { property: "og:title", content: "Entrar — Painel Carvalho's Cell" },
      { property: "og:description", content: "Acesso restrito ao painel de produtos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage("E-mail ou senha incorretos.");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setLoading(false);
      if (error) return setMessage(error.message);
      setMessage("Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre.");
      setMode("login");
    }
  }

  return (
    <main className="mesh flex min-h-screen items-center justify-center bg-background px-5 font-body text-foreground">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-10 flex justify-center"><img src={logoImage} alt="Carvalho's Cell" className="h-10 w-auto" /></Link>
        <div className="rounded-xl border border-border/60 bg-card/70 p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{mode === "login" ? "Painel do administrador" : "Criar conta de administrador"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Entre para publicar e editar produtos." : "A primeira conta criada vira a administradora da loja."}</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm"><span className="text-muted-foreground">E-mail</span>
              <input className="field mt-1.5" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="block text-sm"><span className="text-muted-foreground">Senha</span>
              <input className="field mt-1.5" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </label>
            {message && <p className="text-sm text-primary">{message}</p>}
            <button className="button-primary w-full" disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
          </form>
          <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }} className="nav-link mt-5 text-sm">
            {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
          </button>
        </div>
      </div>
    </main>
  );
}
