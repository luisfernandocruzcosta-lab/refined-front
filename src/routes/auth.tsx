import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "../assets/carvalhos-cell-logo.png";
import { Button } from "@/components/ui/button";

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
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      setLoading(false);
      setMessage(error ? "Não foi possível enviar o link agora. Tente novamente mais tarde." : "Se este e-mail estiver cadastrado, você receberá um link para definir uma nova senha. Confira também o spam.");
      return;
    }
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage("E-mail ou senha incorretos.");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setLoading(false);
      if (error) return setMessage(error.message);
      navigate({ to: "/admin" });
    }
  }

  return (
    <main className="mesh flex min-h-screen items-center justify-center bg-background px-5 font-body text-foreground">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-10 flex justify-center"><img src={logoImage} alt="Carvalho's Cell" className="h-10 w-auto" /></Link>
        <div className="rounded-xl border border-border/60 bg-card/70 p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{mode === "login" ? "Área do lojista" : mode === "forgot" ? "Recuperar senha" : "Criar conta de administrador"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Administrador e funcionários entram aqui para gerir os produtos." : mode === "forgot" ? "Enviaremos um link para o e-mail da sua conta." : "A primeira conta criada vira a administradora da loja."}</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm"><span className="text-muted-foreground">E-mail</span>
              <input className="field mt-1.5" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            {mode !== "forgot" && <label className="block text-sm"><span className="text-muted-foreground">Senha</span>
              <input className="field mt-1.5" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </label>}
            {message && <p role="status" className="text-sm text-primary">{message}</p>}
            <Button className="button-primary w-full" disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "forgot" ? "Enviar link" : "Criar conta"}</Button>
          </form>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {mode === "login" && <Button type="button" variant="link" onClick={() => { setMode("forgot"); setMessage(null); }} className="nav-link h-auto p-0 text-sm text-primary">Esqueci minha senha</Button>}
            <Button type="button" variant="link" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }} className="nav-link h-auto p-0 text-sm text-primary">
              {mode === "login" ? "Primeiro acesso? Criar conta" : "Voltar ao login"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
