import { Suspense } from "react";
import { isGhPages } from "@/lib/deploy";

export default async function VerifyEmailPage() {
  if (isGhPages() || !process.env.DATABASE_URL) {
    const { default: VerifyEmailStatic } = await import("./VerifyEmailStatic");
    return <VerifyEmailStatic />;
  }

  const { default: VerifyEmailClient } = await import("./VerifyEmailClient");
  return (
    <Suspense fallback={null}>
      <VerifyEmailClient />
    </Suspense>
  );
}
