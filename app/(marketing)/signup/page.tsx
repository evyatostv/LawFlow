import { isGhPages } from "@/lib/deploy";

export default async function SignupPage() {
  if (isGhPages() || !process.env.DATABASE_URL) {
    const { default: SignupStatic } = await import("./SignupStatic");
    return <SignupStatic />;
  }

  const { default: SignupClient } = await import("./SignupClient");
  return <SignupClient />;
}
