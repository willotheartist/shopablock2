import AuthPage from "@/components/v2/AuthPage";
import { safeNext } from "@/lib/v2/http";
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const s = await searchParams;
  return <AuthPage next={safeNext(s.next)} error={s.error} />;
}
