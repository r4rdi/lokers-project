"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleJobFeatured(jobId: string, currentStatus: boolean) {
  const supabase = await createServerClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  // Update job
  const { error } = await supabase
    .from("jobs")
    .update({ is_featured: !currentStatus })
    .eq("id", jobId);

  if (error) {
    console.error("Error updating job featured status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath("/");
  
  return { success: true };
}
