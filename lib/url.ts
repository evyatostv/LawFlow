import { headers } from "next/headers";

export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const headerUrl = headers().get("origin") || headers().get("x-forwarded-host");
  if (headerUrl) {
    if (headerUrl.startsWith("http")) return headerUrl.replace(/\/$/, "");
    return `https://${headerUrl}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
