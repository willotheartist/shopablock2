import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Workspace from "@/components/v2/Workspace";
export const metadata = { robots: { index: false, follow: false } };
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await getSessionUser();
  if (!u) redirect("/sign-in?next=/app");
  return <Workspace email={u.email}>{children}</Workspace>;
}
