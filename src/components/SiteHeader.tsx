// src/components/SiteHeader.tsx
import { cookies } from "next/headers";
import SiteHeaderClient from "@/components/SiteHeaderClient";

const SESSION_COOKIE = "sb_session";

export default async function SiteHeader() {
  const jar = await cookies();
  const authed = Boolean(jar.get(SESSION_COOKIE)?.value);
  return <SiteHeaderClient authed={authed} />;
}
