import { NextResponse } from "next/server";
import { ai, COVER_LETTER_PROMPT } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Allow mock behavior in MVP if env is missing
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || !supabaseUrl.includes("placeholder")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Parse request body
    const body = await req.json();
    const { cv_data, job_data } = body;

    if (!cv_data || !job_data) {
      return NextResponse.json(
        { error: "cv_data and job_data are required" },
        { status: 400 }
      );
    }

    // 3. Format the prompt
    const prompt = COVER_LETTER_PROMPT
      .replace("{cv_data}", JSON.stringify(cv_data, null, 2))
      .replace("{job_data}", JSON.stringify(job_data, null, 2));

    // 4. Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const generatedText = response.text;

    // 5. Optionally, save to database directly here or let the client do it.
    // For this MVP, we let the client handle saving it so the user can review/edit first.

    return NextResponse.json({
      success: true,
      content: generatedText,
    });

  } catch (error: any) {
    console.error("Cover Letter Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
