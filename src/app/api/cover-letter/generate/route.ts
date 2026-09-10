import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    // 1. Validasi Autentikasi
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 2. Parse request body
    const body = await request.json();
    const { jobId } = body;
    
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // 3. Ambil data Job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();
      
    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 4. Ambil CV Utama User
    // Note: Jika user bisa punya banyak CV, MVP bisa ambil yang 'is_primary = true' atau yang pertama
    const { data: cvs, error: cvError } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", session.user.id)
      .order("is_primary", { ascending: false })
      .limit(1);

    if (cvError || !cvs || cvs.length === 0) {
      return NextResponse.json({ 
        error: "No CV found. Please create a CV in your dashboard first.",
        code: "NO_CV"
      }, { status: 400 });
    }

    const cv = cvs[0];

    // 5. Inisialisasi Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    // 6. Buat Prompt (Sesuai Blueprint MVP)
    const prompt = `
Kamu adalah konsultan karier profesional dengan 20 tahun pengalaman. Tugasmu menulis surat lamaran kerja yang natural, profesional, dan meyakinkan. Gunakan data CV kandidat dan deskripsi pekerjaan berikut untuk menyesuaikan surat. Jangan mengarang fakta atau pengalaman yang tidak ada di CV. Tulis dengan gaya yang hangat namun formal. Tulis surat lamaran menggunakan bahasa yang paling relevan dengan bahasa deskripsi lowongan kerja. Jika lowongannya berbahasa Indonesia, gunakan bahasa Indonesia.

Data CV Kandidat:
${JSON.stringify(cv.data, null, 2)}

Deskripsi Pekerjaan:
Nama Pekerjaan: ${job.title}
Perusahaan: ${job.company_name}
Deskripsi: ${job.description}
Kebutuhan/Syarat: ${job.requirements || '-'}

Buat surat lamaran dengan struktur: pembukaan, isi (kaitkan pengalaman dan skill dengan kebutuhan pekerjaan), penutup. Panjang sekitar 300-400 kata. Hasil akhir harus langsung berupa teks surat lamaran tanpa perlu pengantar tambahan darimu.
    `;

    // 7. Generate Konten dengan Gemini
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
    });
    const coverLetterContent = response.text;

    // 8. Simpan ke Database
    const { data: insertedCoverLetter, error: insertError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: session.user.id,
        job_id: job.id,
        cv_id: cv.id,
        content: coverLetterContent
      })
      .select("id")
      .single();

    if (insertError || !insertedCoverLetter) {
      console.error("Error inserting cover letter:", insertError);
      return NextResponse.json({ error: "Failed to save cover letter" }, { status: 500 });
    }

    // 9. Berikan Response Sukses
    return NextResponse.json({ 
      success: true, 
      coverLetterId: insertedCoverLetter.id,
      message: "Cover letter generated successfully" 
    });

  } catch (error: any) {
    console.error("Cover Letter Generation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message }, 
      { status: 500 }
    );
  }
}
