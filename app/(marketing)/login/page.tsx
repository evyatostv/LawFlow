import { isGhPages } from "@/lib/deploy";

export default async function LoginPage() {
  if (isGhPages() || !process.env.DATABASE_URL) {
    const { default: LoginStatic } = await import("./LoginStatic");
    return <LoginStatic />;
  }

  const { default: LoginClient } = await import("./LoginClient");
  return <LoginClient />;
}
