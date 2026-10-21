import AuthPage from "@/components/v2/AuthPage";
import { safeNext } from "@/lib/v2/http";
export const metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};
export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const s = await searchParams;
  return <AuthPage signup next={safeNext(s.next)} error={s.error} />;
}
