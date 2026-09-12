import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "employer" && profile.role !== "admin")) {
      return NextResponse.json(
        { error: `Akses ditolak. Akun Anda saat ini terdaftar sebagai '${profile?.role}'. Silakan ubah tipe akun Anda menjadi Employer.` }, 
        { status: 403 }
      );
    }

    // Get body data
    const body = await req.json();
    const { 
      title, 
      company_name, 
      location, 
      job_type, 
      salary_min, 
      salary_max, 
      description, 
      requirements, 
      apply_url 
    } = body;

    // Validate required fields
    if (!title || !company_name || !location || !job_type || !description || !requirements) {
      return NextResponse.json(
        { error: "Semua kolom wajib harus diisi" },
        { status: 400 }
      );
    }

    // Insert job into database
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title,
          company_name,
          location,
          job_type,
          salary_min: salary_min ? parseFloat(salary_min) : null,
          salary_max: salary_max ? parseFloat(salary_max) : null,
          salary_currency: "IDR",
          description,
          requirements,
          apply_url: apply_url || null,
          source: "employer",
          is_active: true,
          created_by: user.id,
          posted_date: new Date().toISOString().split('T')[0], // current date
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
