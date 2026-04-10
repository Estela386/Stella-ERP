"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@utils/supabase/client";
import { useRouter } from "next/navigation";
import ResetLayout from "../_components/ResetLayout";
import NewPasswordCard from "./NewPasswordCard";

export default function ResetPasswordClient() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (mounted) {
        if (data.session) {
          setReady(true);
        } else {
          router.replace("/login");
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
    // 🔥 CAMBIO AQUÍ: Usamos supabase en lugar de supabase.auth
  }, [router, supabase]);

  if (!ready) {
    return (
      <ResetLayout>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79]" />
        </div>
      </ResetLayout>
    );
  }

  return (
    <ResetLayout>
      <NewPasswordCard />
    </ResetLayout>
  );
}
