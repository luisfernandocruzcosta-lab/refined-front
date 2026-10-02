import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logoImage from "../assets/carvalhos-cell-logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Redefinir senha — Carvalho's Cell" },
    { name: "description", content: "Defina uma nova senha para acessar a área do lojista da Carvalho's Cell." },
    { property: "og:title", content: "Redefinir senha — Carvalho's Cell" },
    { property: "og:description", content: "Recuperação de acesso à área do lojista." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const isRecoveryLink = params.get("type") === "recovery";
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (active && event === "PASSWORD_RECOVERY") { setValid(true); setChecking(false); }
    });
    // The auth client may consume the hash before this page mounts.
    supabase.auth.getSession().then(({ data, error }) => {
      if (active) {
        if (isRecoveryLink && !error && data.session) setValid(true);
        setChecking(false);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setMessage("As senhas não coincidem.");
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setMessage("Não foi possível alterar a senha. Solicite um novo link e tente novamente.");
    setMessage("Senha alterada com sucesso. Redirecionando para o painel...");
    navigate({ to: "/admin", replace: true });
  }

  return <main className="mesh flex min-h-screen items-center justify-center bg-background px-5 font-body text-foreground">
    <div className="w-full max-w-sm">
      <Link to="/" className="mb-10 flex justify-center"><img src={logoImage} alt="Carvalho's Cell" className="h-10 w-auto max-w-full object-contain" /></Link>
      <div className="rounded-lg border border-border/60 bg-card/70 p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold">Definir nova senha</h1>
        {checking ? <p className="mt-4 text-sm text-muted-foreground">Verificando link...</p> : valid ?
          <form onSubmit={save} className="mt-6 space-y-4">
            <label className="block text-sm"><span className="text-muted-foreground">Nova senha</span><input className="field mt-1.5" type="password" autoComplete="new-password" required minLength={6} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} /></label>
            <label className="block text-sm"><span className="text-muted-foreground">Confirmar nova senha</span><input className="field mt-1.5" type="password" autoComplete="new-password" required minLength={6} maxLength={72} value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
            {message && <p role="status" className="text-sm text-primary">{message}</p>}
            <Button className="button-primary w-full" disabled={loading}>{loading ? "Salvando..." : "Salvar senha"}</Button>
          </form> : <p className="mt-4 text-sm text-muted-foreground">Este link é inválido ou expirou. Solicite outro na área de login.</p>}
        <Link to="/auth" className="nav-link mt-6 text-sm text-primary">Voltar ao login</Link>
      </div>
    </div>
  </main>;
}