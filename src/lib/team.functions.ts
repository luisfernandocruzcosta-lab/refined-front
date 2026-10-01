import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Sem permissão");
}

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role").eq("role", "staff");
    const ids = new Set((roles ?? []).map((r) => r.user_id));
    const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    return (data?.users ?? []).filter((u) => ids.has(u.id)).map((u) => ({ id: u.id, email: u.email ?? "" }));
  });

export const createStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().trim().email().max(255), password: z.string().min(6).max(72) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true });
    if (error || !created.user) return { ok: false as const, error: error?.message ?? "Erro ao criar conta" };
    await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: "staff" });
    return { ok: true as const };
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("Não é possível remover a própria conta");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: role } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", data.id).eq("role", "staff").maybeSingle();
    if (!role) throw new Error("Conta não é de funcionário");
    await supabaseAdmin.auth.admin.deleteUser(data.id);
    return { ok: true };
  });
