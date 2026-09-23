import { exigirAdmin } from "@/lib/admin";
import { FormModulo } from "../form-modulo";

export const metadata = { title: "Novo módulo — 150 Festas Infantis" };

export default async function NovoModuloPage() {
  await exigirAdmin();
  return <FormModulo />;
}
