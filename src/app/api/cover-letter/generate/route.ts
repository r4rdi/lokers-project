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

    // 6. Buat Prompt (Sesuai Blueprint MVP - ATS Friendly)
    const prompt = `
Kamu adalah Master Konsultan Karier & Pakar ATS (Applicant Tracking System) dengan 20 tahun pengalaman.
Tugasmu adalah menulis surat lamaran kerja (Cover Letter) yang profesional, memikat HRD, dan dioptimalkan 100% untuk lolos filter sistem ATS.

PANDUAN ATS-FRIENDLY:
1. Cocokkan secara eksplisit "Kebutuhan/Syarat" dari deskripsi pekerjaan dengan "Data CV" (skills, pengalaman). Gunakan kata kunci (keywords) persis seperti di lowongan jika kandidat memilikinya.
2. Sorot hasil (angka/metrik) dari pengalaman CV kandidat (misal: "berhasil meningkatkan X sebanyak Y%").
3. Jangan pernah mengarang pengalaman, skill, atau angka yang tidak ada di dalam Data CV.
4. Gunakan bahasa yang sama dengan deskripsi pekerjaan (jika pekerjaan ditulis dalam Bahasa Indonesia, tulis surat dalam Bahasa Indonesia yang formal dan lugas. Jika dalam bahasa Inggris, gunakan bahasa Inggris profesional).

STRUKTUR SURAT LAMARAN (Tanpa Alamat/Tanggal di atas, langsung mulai dari sapaan):
- Sapaan: Kepada Yth. Hiring Manager / Tim Rekrutmen [Nama Perusahaan],
- Pembuka: Niat melamar dengan menyebutkan posisi [Nama Pekerjaan] secara spesifik.
- Value Proposition (1 paragraf): Ringkasan mengapa kandidat sangat cocok, menyebutkan total pengalaman atau keunggulan utama.
- Pencapaian Utama (Gunakan 3-4 Bullet Points): Kaitkan secara langsung pengalaman dari CV kandidat dengan requirements loker. Gunakan angka jika ada.
- Penutup: Antusiasme untuk wawancara dan Call to Action.

Data CV Kandidat:
${JSON.stringify(cv.data, null, 2)}

Deskripsi Pekerjaan:
Nama Pekerjaan: ${job.title}
Perusahaan: ${job.company_name}
Deskripsi: ${job.description}
Kebutuhan/Syarat: ${job.requirements || '-'}

HANYA KEMBALIKAN TEKS SURAT LAMARAN. Jangan menambahkan pembuka/penutup pesan (seperti "Ini surat Anda:"). Pastikan format paragraf dan bullet points rapi.
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
