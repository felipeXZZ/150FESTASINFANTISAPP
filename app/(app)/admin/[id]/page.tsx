import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { FormModulo } from "../form-modulo";

export const metadata = { title: "Editar módulo — 150 Festas Infantis" };

export default async function EditarModuloPage({ params }: PageProps<"/admin/[id]">) {
  await exigirAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await createAdminClient()
    .from("modulos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return <FormModulo modulo={data} />;
}
