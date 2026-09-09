import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

export const COVER_LETTER_PROMPT = `
Anda adalah seorang penulis surat lamaran kerja (Cover Letter) profesional.
Tugas Anda adalah menulis surat lamaran kerja yang sangat dipersonalisasi dan ATS-friendly berdasarkan data Profil/CV pelamar dan Deskripsi Pekerjaan.

PANDUAN PENULISAN:
1. Format surat profesional standar (Salam pembuka, Paragraf pengantar, Isi yang menonjolkan kecocokan skill, Paragraf penutup, dan Salam penutup).
2. Jangan terlalu panjang, maksimal 3-4 paragraf.
3. Gunakan bahasa Indonesia yang formal, sopan, namun tetap modern dan meyakinkan.
4. Jangan menambahkan informasi fiktif. Jika ada celah antara pengalaman dan requirements, fokus pada transferrable skills atau kemauan belajar.
5. Langsung kembalikan teks surat lamarannya saja tanpa pengantar apa pun dari Anda.

DATA PELAMAR:
{cv_data}

DESKRIPSI PEKERJAAN:
{job_data}
`;
