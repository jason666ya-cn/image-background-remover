"use client";

import { useTransition } from "react";
import { signIn, signOut } from "next-auth/react";

type AuthButtonProps = {
  isAuthenticated: boolean;
};

export function AuthButton({ isAuthenticated }: AuthButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (isAuthenticated) {
        await signOut({ callbackUrl: "/" });
        return;
      }
      await signIn("google", { callbackUrl: "/" });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait..." : isAuthenticated ? "Logout" : "Sign in with Google"}
    </button>
  );
}
