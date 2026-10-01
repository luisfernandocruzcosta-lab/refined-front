import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, CONDITIONS, TAGS, DEFAULT_SETTINGS, fetchSettings, type StoreSettings, fetchProducts, formatPrice, type Product } from "@/lib/products";
import logoImage from "../../assets/carvalhos-cell-logo.png";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Produtos — Painel Carvalho's Cell" },
      { name: "description", content: "Cadastre, edite e remova produtos da vitrine." },
      { property: "og:title", content: "Produtos — Painel Carvalho's Cell" },
      { property: "og:description", content: "Gerencie a vitrine da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type FormState = { id?: string; name: string; brand: string; category: string; condition: string; detail: string; description: string; price: string; old_price: string; tag: string; image_path: string | null };
const empty: FormState = { name: "", brand: "", category: "iPhone", condition: "Novo", detail: "", description: "", price: "", old_price: "", tag: "", image_path: null };

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["my-role", user.id],
    queryFn: async (): Promise<"admin" | "staff" | null> => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = (data ?? []).map((r) => r.role as string);
      return roles.includes("admin") ? "admin" : roles.includes("staff") ? "staff" : null;
    },
  });
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts, enabled: !!role.data });
  const [form, setForm] = useState<FormState>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function edit(p: Product) {
    setForm({ id: p.id, name: p.name, brand: p.brand, category: p.category, condition: p.condition, detail: p.detail, description: p.description ?? "", price: String(p.price), old_price: p.old_price ? String(p.old_price) : "", tag: p.tag ?? "", image_path: p.image_path });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(p: Product) {
    if (!confirm(`Remover ${p.name}?`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    if (p.image_path) await supabase.storage.from("product-images").remove([p.image_path]);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.price.replace(",", "."));
    const oldPrice = form.old_price ? Number(form.old_price.replace(",", ".")) : null;
    if (!form.name.trim() || !form.brand.trim() || !(price > 0)) return setMsg("Preencha nome, marca e preço válido.");
    setSaving(true);
    setMsg(null);
    let image_path = form.image_path;
    if (file) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
      if (error) { setSaving(false); return setMsg("Não foi possível enviar a foto."); }
      if (form.image_path) await supabase.storage.from("product-images").remove([form.image_path]);
      image_path = path;
    }
    const payload = { name: form.name.trim().slice(0, 120), brand: form.brand.trim().slice(0, 60), category: form.category, condition: form.condition, detail: form.detail.trim().slice(0, 200), description: form.description.trim().slice(0, 2000), price, old_price: oldPrice, tag: form.tag || null, image_path };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) return setMsg("Erro ao salvar o produto.");
    setMsg(form.id ? "Produto atualizado." : "Produto publicado na vitrine.");
    setForm(empty);
    setFile(null);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <main className="mesh min-h-screen bg-background font-body text-foreground">
      <header className="border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/"><img src={logoImage} alt="Carvalho's Cell" className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="nav-link hidden sm:inline-flex">Ver site</Link>
            <button onClick={signOut} className="button-secondary">Sair</button>
          </div>
        </div>
      </header>

      {role.isLoading ? <p className="p-10 text-center text-muted-foreground">Carregando...</p> : !role.data ? (
        <div className="mx-auto max-w-md p-10 text-center">
          <h1 className="font-display text-2xl font-semibold">Sem permissão</h1>
          <p className="mt-2 text-muted-foreground">Esta conta não tem acesso à área do lojista. Peça ao administrador para criar sua conta.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <p className="section-label">{form.id ? "Editando" : "Novo produto"}</p>
            <h1 className="mt-2 font-display text-2xl font-semibold">{form.id ? form.name : "Publicar na vitrine"}</h1>
            <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
              <Field label="Foto">
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="field file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground" />
              </Field>
              <Field label="Nome"><input className="field" value={form.name} onChange={set("name")} placeholder="iPhone 15" required /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Marca"><input className="field" value={form.brand} onChange={set("brand")} placeholder="Apple" required /></Field>
                <Field label="Categoria"><select className="field" value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Estado"><select className="field" value={form.condition} onChange={set("condition")}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></Field>
                <Field label="Etiqueta"><select className="field" value={form.tag} onChange={set("tag")}>{TAGS.map((t) => <option key={t} value={t}>{t || "Nenhuma"}</option>)}</select></Field>
              </div>
              <Field label="Detalhes"><input className="field" value={form.detail} onChange={set("detail")} placeholder="128GB · Azul" /></Field>
              <Field label="Descrição completa"><textarea className="field min-h-32 resize-y" maxLength={2000} value={form.description} onChange={set("description")} placeholder="Especificações, saúde da bateria, garantia, itens inclusos..." /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (R$)"><input className="field" inputMode="decimal" value={form.price} onChange={set("price")} placeholder="4899" required /></Field>
                <Field label="Preço antigo"><input className="field" inputMode="decimal" value={form.old_price} onChange={set("old_price")} placeholder="Opcional" /></Field>
              </div>
              {msg && <p className="text-sm text-primary">{msg}</p>}
              <div className="flex gap-3">
                <button className="button-primary flex-1" disabled={saving}>{saving ? "Salvando..." : form.id ? "Salvar" : "Publicar"}</button>
                {form.id && <button type="button" className="button-secondary" onClick={() => { setForm(empty); setFile(null); }}>Cancelar</button>}
              </div>
            </form>
          </section>

          <section className="lg:col-span-3">
            <p className="section-label">Vitrine</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Produtos publicados</h2>
            <div className="mt-6 space-y-3">
              {products.isLoading && <p className="text-muted-foreground">Carregando...</p>}
              {products.data?.length === 0 && <p className="text-muted-foreground">Nenhum produto ainda. Publique o primeiro ao lado.</p>}
              {products.data?.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 p-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">{p.imageUrl && <img src={p.imageUrl} alt="" className="size-full object-cover" />}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name} {p.tag && <span className="ml-1 text-xs text-primary">· {p.tag}</span>}</p>
                    <p className="truncate text-sm text-muted-foreground">{p.category} · {p.condition} · {formatPrice(Number(p.price))}</p>
                  </div>
                  <button onClick={() => edit(p)} className="nav-link text-sm">Editar</button>
                  <button onClick={() => remove(p)} className="nav-link text-sm">Remover</button>
                </div>
              ))}
            </div>
          </section>

          {role.data === "admin" && <TeamSection />}
          {role.data === "admin" && <StoreSettingsForm />}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="text-muted-foreground">{label}</span><div className="mt-1.5">{children}</div></label>;
}

function StoreSettingsForm() {
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const v = form ?? settings.data ?? DEFAULT_SETTINGS;
  const set = (k: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...v, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const whatsapp = v.whatsapp.replace(/\D/g, "");
    if (whatsapp.length < 10) return setMsg("Informe o WhatsApp com DDD (ex.: 5511999999999).");
    setSaving(true);
    const payload = { id: 1, address: v.address.trim().slice(0, 200), whatsapp, instagram: v.instagram.trim().replace(/^@/, "").slice(0, 60), hours: v.hours.trim().slice(0, 120) };
    const { error } = await supabase.from("store_settings").upsert(payload);
    setSaving(false);
    setMsg(error ? "Erro ao salvar os dados." : "Dados da loja atualizados.");
    if (!error) { setForm(null); qc.invalidateQueries({ queryKey: ["settings"] }); }
  }

  return (
    <section className="lg:col-span-5">
      <p className="section-label">Loja</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Dados e endereço</h2>
      <form onSubmit={save} className="mt-6 grid gap-4 rounded-xl border border-border/60 bg-card/70 p-5 sm:grid-cols-2">
        <Field label="Endereço"><input className="field" value={v.address} onChange={set("address")} placeholder="Rua Exemplo, 123 — Centro, São Paulo" /></Field>
        <Field label="Horário de funcionamento"><input className="field" value={v.hours} onChange={set("hours")} placeholder="Seg a Sáb, 9h às 18h" /></Field>
        <Field label="WhatsApp (com DDI e DDD)"><input className="field" inputMode="tel" value={v.whatsapp} onChange={set("whatsapp")} placeholder="5511999999999" /></Field>
        <Field label="Instagram"><input className="field" value={v.instagram} onChange={set("instagram")} placeholder="carvalhoscell" /></Field>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button className="button-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar dados"}</button>
          {msg && <p className="text-sm text-primary">{msg}</p>}
        </div>
      </form>
    </section>
  );
}
