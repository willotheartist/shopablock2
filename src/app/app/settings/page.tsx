import { Container, Panel, Kicker, Button } from "@/components/ui";

export default function SettingsPage() {
  return (
    <Container narrow>
      <div className="py-10 grid gap-8">

        <Kicker>Settings</Kicker>

        <h1 className="text-2xl font-semibold tracking-tight">
          Account
        </h1>

        {/* Account */}
        <Panel>
          <div className="p-6 grid gap-4 text-sm">
            <div>
              <div className="text-(--muted)">Email</div>
              <div>seller@example.com</div>
            </div>

            <div>
              <div className="text-(--muted)">Payouts</div>
              <div>Not connected</div>
            </div>
          </div>
        </Panel>

        {/* Danger zone */}
        <Panel>
          <div className="p-6 grid gap-4">
            <div className="text-sm font-medium">Danger zone</div>

            <Button variant="outline">
              Delete account
            </Button>
          </div>
        </Panel>

      </div>
    </Container>
  );
}
