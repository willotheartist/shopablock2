//·src/app/app/settings/page.tsx
import { Container, Panel, Kicker, Button } from "@/components/ui";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PayoutsConnectButton from "@/components/PayoutsConnectButton";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <Container narrow>
        <div className="py-10">Unauthorized</div>
      </Container>
    );
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  const status = dbUser?.payoutsStatus ?? "not_started";
  const statusLabel =
    status === "active"
      ? "Connected"
      : status === "pending"
        ? "Pending"
        : status === "restricted"
          ? "Restricted"
          : "Not connected";

  return (
    <Container narrow>
      <div className="py-10 grid gap-8">
        <Kicker>Settings</Kicker>

        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>

        <Panel>
          <div className="p-6 grid gap-4 text-sm">
            <div>
              <div className="text-(--muted)">Email</div>
              <div>{dbUser?.email ?? user.email}</div>
            </div>

            <div className="grid gap-2">
              <div>
                <div className="text-(--muted)">Payouts</div>
                <div>{statusLabel}</div>
              </div>

              {/* KompiPay v1: Onboarding is handled in KompiPay dashboard (merchant UI), not via partner API */}
              <PayoutsConnectButton />
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="p-6 grid gap-4">
            <div className="text-sm font-medium">Danger zone</div>
            <Button variant="outline">Delete account</Button>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
