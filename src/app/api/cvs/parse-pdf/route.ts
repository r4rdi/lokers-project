import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
const pdfParse = require("pdf-parse");

// We need to disable body parsing for this route to handle multipart/form-data natively or via request.formData()
// Actually, next/server Request object has .formData() built-in.

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // Convert the File object to a Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from the PDF" }, { status: 400 });
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct the prompt to ask Gemini to output JSON
    const prompt = `
Kamu adalah sistem ekstraksi data ATS (Applicant Tracking System) profesional.
Tugasmu adalah memindai teks mentah CV berikut dan mengekstrak informasi penting ke dalam format JSON yang tepat dan terstruktur.

PENTING: Ekstraksi ini digunakan untuk keperluan ATS matching. Pastikan semua *hard skills*, perangkat lunak (software/tools), bahasa pemrograman, metrik/angka keberhasilan (misal: "meningkatkan penjualan 20%"), dan kata kunci industri diekstrak secara akurat.

Teks Mentah CV:
"""
${rawText}
"""

Kembalikan HANYA JSON murni yang sesuai dengan struktur persis berikut, tanpa tag markdown, tanpa penjelasan:
{
  "fullName": "String - Nama lengkap kandidat",
  "email": "String - Alamat email",
  "phone": "String - Nomor telepon",
  "location": "String - Lokasi tempat tinggal atau asal",
  "linkedin": "String - URL profil LinkedIn (jika ada, kosongkan jika tidak)",
  "github": "String - URL profil GitHub (jika ada, kosongkan jika tidak)",
  "summary": "String - Ringkasan singkat profesional atau deskripsi diri yang menonjolkan keahlian utama",
  "experience": [
    {
      "title": "String - Posisi atau Jabatan",
      "company": "String - Nama perusahaan",
      "startDate": "String - Tanggal mulai (misal: Jan 2020 atau 2020)",
      "endDate": "String - Tanggal selesai (misal: Saat ini atau Des 2022)",
      "description": "String - Deskripsi tanggung jawab dan pencapaian (wajib pertahankan angka/metrik jika ada)"
    }
  ],
  "education": [
    {
      "institution": "String - Nama sekolah atau universitas",
      "degree": "String - Gelar atau tingkatan (misal: S1, Bachelor, Sarjana)",
      "field": "String - Jurusan atau bidang studi",
      "startDate": "String - Tanggal mulai",
      "endDate": "String - Tanggal selesai"
    }
  ],
  "skills": ["Array of Strings - Ekstrak setiap keahlian individu (khususnya hard skills/tools) ke dalam list terpisah"]
}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
    });
    let jsonText = (response.text || "").trim();
    
    // Clean up potential markdown blocks if Gemini still outputs them
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", jsonText);
      throw new Error("AI mengembalikan format yang tidak valid.");
    }

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error("PDF Parsing/AI Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
