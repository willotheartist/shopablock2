//·src/app/api/kompipay/connect/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(
    {
      error:
        "Payout onboarding is managed in the KompiPay dashboard (merchant UI), not via API.",
    },
    { status: 400 }
  );
}
