import { isGhPages } from "@/lib/deploy";

export default async function VerifyEmailPage() {
  if (isGhPages()) {
    const { default: VerifyEmailStatic } = await import("./VerifyEmailStatic");
    return <VerifyEmailStatic />;
  }

  const { default: VerifyEmailClient } = await import("./VerifyEmailClient");
  return <VerifyEmailClient />;
}
