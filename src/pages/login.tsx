import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    signIn("custom", { callbackUrl: "/" });
  }, []);

  return null;
}
