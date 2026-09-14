import { createServerClient } from "@/lib/supabase/server";
import { Shield, ShieldAlert, ShieldCheck, MoreVertical } from "lucide-react";

export const metadata = {
  title: "Manajemen Pengguna - Admin Dashboard",
};

export default async function AdminUsersPage() {
  const supabase = await createServerClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // Middleware handles redirect

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-error mb-2">Akses Ditolak</h2>
        <p className="text-text-muted">Hanya administrator yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  // Fetch all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-1">
          Manajemen Pengguna
        </h1>
        <p className="text-text-muted">
          Kelola semua akun pengguna terdaftar (Job Seeker dan Employer).
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-error">
            Gagal memuat data pengguna.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-border text-text-subtle text-sm">
                  <th className="py-4 px-6 font-medium">Pengguna</th>
                  <th className="py-4 px-6 font-medium">Email</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Bergabung</th>
                  <th className="py-4 px-6 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {u.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-ink">{u.full_name || "Tanpa Nama"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-text-muted">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
                          <ShieldAlert className="w-3 h-3" /> Admin
                        </span>
                      ) : u.role === 'employer' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                          <Shield className="w-3 h-3" /> Employer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                          <ShieldCheck className="w-3 h-3" /> Job Seeker
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-ink">
                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-text-muted hover:text-ink rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
