"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");;
    }
  }, []);

  return (
    <>
      <main>{children}</main>
    </>
  );
}
