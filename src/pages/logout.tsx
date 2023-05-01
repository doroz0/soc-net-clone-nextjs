import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    // TODO: There has to be a better way
    signOut().then(() => {
      const returnUrl = encodeURIComponent(process.env.NEXT_PUBLIC_URL!);
      location.href = `${process.env.NEXT_PUBLIC_AUTH_URL!}/Account/Logout?ReturnUrl=${returnUrl}`;
    });
  }, []);

  return null;
}
