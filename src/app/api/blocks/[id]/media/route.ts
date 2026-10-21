import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Please use the updated product editor to upload files." },
    { status: 410 },
  );
}
