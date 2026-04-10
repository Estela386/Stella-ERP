import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PredictionEngine } from "@/backend/ai/predictions/PredictionEngine";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Initial check to determine if user might be admin/authorized
    // Note: depending on global setup, you might check roles here.
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const engine = new PredictionEngine(supabase);
    const insights = await engine.generateInsights();

    return NextResponse.json({
       success: true,
       data: insights
    });

  } catch (err: any) {
    console.error("[API Predictions] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
