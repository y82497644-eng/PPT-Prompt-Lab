import { NextResponse } from "next/server";
import { getRuntimeConfig } from "@/lib/config/runtime";

export function GET() {
  const { appEnvironment } = getRuntimeConfig();
  return NextResponse.json({ status: "ok", app: "yejian", environment: appEnvironment });
}
