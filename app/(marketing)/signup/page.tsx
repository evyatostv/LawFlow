import { isGhPages } from "@/lib/deploy";

export default async function SignupPage() {
  if (isGhPages()) {
    const { default: SignupStatic } = await import("./SignupStatic");
    return <SignupStatic />;
  }

  const { default: SignupClient } = await import("./SignupClient");
  return <SignupClient />;
}
