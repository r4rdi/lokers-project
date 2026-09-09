"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

interface CVFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function CVForm({ initialData, onSubmit, isLoading = false }: CVFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "CV Baru",
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    summary: initialData?.summary || "",
    experience: initialData?.experience || [],
    education: initialData?.education || [],
    skills: initialData?.skills || [],
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", startDate: "", endDate: "", description: "" }
      ]
    }));
  };

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: newExp }));
  };

  const handleRemoveExperience = (index: number) => {
    const newExp = formData.experience.filter((_: any, i: number) => i !== index);
    setFormData((prev) => ({ ...prev, experience: newExp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
        <h3 className="text-h3 text-ink border-b border-border pb-4">Informasi Dasar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-label text-text mb-2">Nama Profil CV (Internal)</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-label text-text mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-label text-text mb-2">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-label text-text mb-2">Nomor Telepon</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-label text-text mb-2">Ringkasan Profesional (Summary)</label>
            <textarea 
              value={formData.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none resize-y"
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-h3 text-ink">Pengalaman Kerja</h3>
          <button 
            type="button"
            onClick={handleAddExperience}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {formData.experience.length === 0 ? (
          <p className="text-sm text-text-muted italic text-center py-4">Belum ada pengalaman kerja yang ditambahkan.</p>
        ) : (
          <div className="space-y-8">
            {formData.experience.map((exp: any, index: number) => (
              <div key={index} className="p-5 border border-border rounded-lg bg-surface-muted relative group">
                <button 
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-subtle mb-1">Posisi / Jabatan</label>
                    <input 
                      type="text" 
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(index, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-subtle mb-1">Perusahaan</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-subtle mb-1">Tanggal Mulai</label>
                    <input 
                      type="text" 
                      placeholder="YYYY-MM atau Jan 2020"
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(index, "startDate", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-subtle mb-1">Tanggal Selesai</label>
                    <input 
                      type="text" 
                      placeholder="YYYY-MM atau Saat ini"
                      value={exp.endDate}
                      onChange={(e) => handleUpdateExperience(index, "endDate", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-subtle mb-1">Deskripsi Pekerjaan</label>
                    <textarea 
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="py-3 px-8 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan CV
            </>
          )}
        </button>
      </div>
    </form>
  );
}
