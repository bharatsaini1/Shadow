"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-paper dark:bg-ink flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-rule-light dark:border-rule-2 border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
}
