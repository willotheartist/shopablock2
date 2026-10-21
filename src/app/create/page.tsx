import Builder from "@/components/v2/Builder";
import { getSessionUser } from "@/lib/auth";
export const metadata = { title: "Create your shop" };
export default async function Create() {
  const u = await getSessionUser();
  return <Builder userId={u?.id} payouts={u?.payoutsStatus === "active"} />;
}
