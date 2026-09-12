import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    // Validate authentication and admin role
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { site = "linkedin", search = "software engineer", location = "Indonesia", limit = 10 } = body;
    
    // Trigger python script (non-blocking)
    const scriptPath = path.join(process.cwd(), "scripts", "scraper.py");
    
    // Note: In production (Vercel), this child_process approach won't work perfectly 
    // due to serverless constraints. This is for the MVP / local / VPS setup.
    // In Vercel, you'd trigger a GitHub Action webhook or external service here instead.
    
    // Try to use 'python3' first, fallback to 'python'
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    
    const scraperProcess = spawn(pythonCmd, [
      scriptPath,
      "--site", site,
      "--search", search,
      "--location", location,
      "--limit", limit.toString()
    ]);
    
    scraperProcess.stdout.on("data", (data) => {
      console.log(`Scraper stdout: ${data}`);
    });
    
    scraperProcess.stderr.on("data", (data) => {
      console.error(`Scraper stderr: ${data}`);
    });
    
    scraperProcess.on("close", (code) => {
      console.log(`Scraper process exited with code ${code}`);
    });
    
    // Return early to avoid blocking the HTTP request
    return NextResponse.json({ 
      success: true, 
      message: `Scraping process for ${site} started in the background. Check scraping logs for updates.` 
    });
    
  } catch (error) {
    console.error("Scrape API Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
