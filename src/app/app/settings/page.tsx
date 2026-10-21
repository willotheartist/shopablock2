import { requirePageUser } from "@/lib/v2/session";
import { paymentsConfigured } from "@/lib/kompipay";
import Settings from "@/components/v2/Settings";
export const metadata = { title: "Settings" };
export default async function SettingsPage() {
  const u = await requirePageUser();
  return (
    <main id="main">
      <div className="workspace-top">
        <div>
          <span className="eyebrow">THE LITTLE DETAILS</span>
          <h1>Make it yours.</h1>
          <p>Your account and the home for your earnings.</p>
        </div>
      </div>
      <Settings
        name={u.displayName}
        email={u.email}
        payouts={u.payoutsStatus}
        connected={!!u.kompipayAccountId}
        configured={paymentsConfigured()}
      />
    </main>
  );
}
