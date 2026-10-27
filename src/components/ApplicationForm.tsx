import React, { useState, useEffect } from 'react';
import {
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { JenisSurat, Penduduk, PengajuanSurat } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  initialJenisId?: string;
  onSuccess: (pengajuan: PengajuanSurat) => void;
  onNavigateToTrack: (resi: string) => void;
}

export const ApplicationForm: React.FC<Props> = ({
  initialJenisId,
  onSuccess,
  onNavigateToTrack,
}) => {
  const [nikInput, setNikInput] = useState('');
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [allPenduduk, setAllPenduduk] = useState<Penduduk[]>([]);

  const jenisList = storageService.getJenisSuratList();
  const [selectedJenisId, setSelectedJenisId] = useState<string>(
    initialJenisId || jenisList[0]?.id_jenis || 'sku'
  );

  const [keperluan, setKeperluan] = useState('');
  const [detailFields, setDetailFields] = useState<Record<string, string>>({});
  const [pernyataanBenar, setPernyataanBenar] = useState(false);
  const [submittedPengajuan, setSubmittedPengajuan] = useState<PengajuanSurat | null>(null);
  const [copied, setCopied] = useState(false);

  // Load sample residents for easy demo
  useEffect(() => {
    setAllPenduduk(storageService.getPendudukList());
  }, []);

  // When initialJenisId changes from parent
  useEffect(() => {
    if (initialJenisId) {
      setSelectedJenisId(initialJenisId);
    }
  }, [initialJenisId]);

  // Live lookup NIK
  const handleNikChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    setNikInput(clean);

    if (clean.length === 16) {
      const found = storageService.findPendudukByNik(clean);
      if (found) {
        setPenduduk(found);
        setNotFound(false);
      } else {
        setPenduduk(null);
        setNotFound(true);
      }
    } else {
      setPenduduk(null);
      setNotFound(false);
    }
  };

  // Quick select demo resident
  const handleSelectDemoResident = (nik: string) => {
    handleNikChange(nik);
  };

  const selectedJenis = jenisList.find((j) => j.id_jenis === selectedJenisId);

  // Handle dynamic field changes
  const handleFieldChange = (key: string, val: string) => {
    setDetailFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penduduk || !selectedJenis || !keperluan.trim() || !pernyataanBenar) {
      return;
    }

    const newPengajuan = storageService.createPengajuan({
      nik_pemohon: penduduk.nik,
      id_jenis: selectedJenis.id_jenis,
      keperluan: keperluan.trim(),
      detail_khusus: detailFields,
    });

    setSubmittedPengajuan(newPengajuan);
    onSuccess(newPengajuan);
  };

  const copyResi = () => {
    if (!submittedPengajuan) return;
    navigator.clipboard.writeText(submittedPengajuan.no_resi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SUCCESS SUBMISSION SCREEN
  if (submittedPengajuan) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-md">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Permohonan Surat Berhasil Dikirim!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Berkas pengajuan Anda telah masuk ke sistem antrean Pemerintah Desa Madusari dan siap
            diverifikasi oleh Sekdes / Kaur.
          </p>
        </div>

        {/* Resi Box */}
        <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs text-slate-500 block">Nomor Resi Pelacakan</span>
              <span className="text-lg font-mono font-bold text-emerald-800">
                {submittedPengajuan.no_resi}
              </span>
            </div>
            <button
              type="button"
              onClick={copyResi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Resi
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Pemohon:</span>
              <span className="font-semibold text-slate-800">{penduduk?.nama}</span>
            </div>
            <div>
              <span className="text-slate-500 block">NIK:</span>
              <span className="font-mono text-slate-800">{penduduk?.nik}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Jenis Surat:</span>
              <span className="font-medium text-slate-800">{selectedJenis?.nama_surat}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status Awal:</span>
              <span className="text-amber-700 font-semibold font-mono">Pending (Menunggu Verifikasi)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigateToTrack(submittedPengajuan.no_resi)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
          >
            <Search className="w-4 h-4" />
            Lacak Posisi Berkas
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmittedPengajuan(null);
              setKeperluan('');
              setDetailFields({});
              setPernyataanBenar(false);
            }}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors"
          >
            Buat Pengajuan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 sm:px-6">
      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          <Building className="w-3.5 h-3.5" />
          <span>Layanan Administrasi Mandiri Warga Desa Madusari</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Pengajuan Surat Online
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Ketikkan NIK Anda untuk memuat data kependudukan secara otomatis. Tidak perlu input ulang identitas diri.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: IDENTITAS KEPENDUDUKAN (NIK AUTO-DETECT) */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center">
              1
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Identifikasi Nomor Induk Kependudukan (NIK)
            </h2>
          </div>

          {/* Quick Demo Pick for Examiner / Dosen */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pilih Contoh NIK Warga Desa Madusari (Klik untuk Demo Cepat):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allPenduduk.map((p) => (
                <button
                  key={p.nik}
                  type="button"
                  onClick={() => handleSelectDemoResident(p.nik)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                    nikInput === p.nik
                      ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <span className="font-semibold">{p.nama}</span>
                  <span className="text-[11px] opacity-80 ml-1">({p.dusun.replace('Dusun ', '')})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="nik" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Masukkan 16 Digit NIK Warga:
            </label>
            <div className="relative max-w-md">
              <input
                id="nik"
                type="text"
                maxLength={16}
                value={nikInput}
                onChange={(e) => handleNikChange(e.target.value)}
                placeholder="Contoh: 3510041405900001"
                className="w-full px-4 py-2.5 text-base font-mono tracking-wider bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
              />
              {penduduk && (
                <div className="absolute right-3 top-2.5 text-emerald-600 flex items-center gap-1 text-xs font-medium">
                  <UserCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Terverifikasi</span>
                </div>
              )}
            </div>

            {notFound && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">NIK belum terdaftar di Data Kependudukan Desa Madusari.</p>
                  <p className="mt-0.5">
                    Silakan gunakan salah satu tombol contoh warga di atas atau hubungi Perangkat Desa
                    untuk pemutakhiran data kependudukan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AUTO-POPULATED RESIDENT CARD */}
          {penduduk && (
            <div className="mt-5 p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Data Kependudukan Ditemukan (Otomatis Terisi)
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {penduduk.dusun}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900 uppercase">{penduduk.nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">RT / RW & Dusun:</span>
                  <span className="font-medium text-slate-800">
                    RT {penduduk.rt_rw} · {penduduk.dusun}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tempat, Tanggal Lahir:</span>
                  <span className="text-slate-800">{penduduk.tempat_tanggal_lahir}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pekerjaan:</span>
                  <span className="text-slate-800">{penduduk.pekerjaan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status Perkawinan:</span>
                  <span className="text-slate-800">{penduduk.status_perkawinan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status Sosial Ekonomi:</span>
                  <span className="font-semibold text-slate-800">{penduduk.status_ekonomi}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: PILIH JENIS SURAT */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center">
              2
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Pilih Jenis Surat yang Dibutuhkan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {jenisList.map((j) => {
              const isSelected = j.id_jenis === selectedJenisId;
              return (
                <button
                  key={j.id_jenis}
                  type="button"
                  onClick={() => setSelectedJenisId(j.id_jenis)}
                  className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-slate-500">Kode {j.kode_surat}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="font-bold text-sm text-slate-900">{j.singkatan}</div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{j.nama_surat}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedJenis && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Deskripsi Surat: </span>
              {selectedJenis.deskripsi}
            </div>
          )}
        </div>

        {/* STEP 3: KEPERLUAN & DETAIL KHUSUS SURAT */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center">
              3
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Detail & Keperluan Surat
            </h2>
          </div>

          <div className="space-y-4">
            {/* Dynamic fields from selected letter */}
            {selectedJenis?.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={detailFields[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    required={field.required}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                  >
                    <option value="">-- Pilih {field.label} --</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows={2}
                    value={detailFields[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={detailFields[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                  />
                )}
              </div>
            ))}

            {/* General Keperluan */}
            <div className="space-y-1">
              <label htmlFor="keperluan" className="block text-xs font-semibold text-slate-700">
                Keperluan Lengkap Surat <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="keperluan"
                rows={3}
                required
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                placeholder="Jelaskan secara singkat keperluan penerbitan surat ini..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>

            {/* Pernyataan persetujuan */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pernyataanBenar}
                  onChange={(e) => setPernyataanBenar(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600">
                  Saya menyatakan dengan sebenarnya bahwa data yang saya masukkan adalah benar sesuai data kependudukan
                  saya di Desa Madusari dan permohonan ini dibuat untuk kepentingan yang sah.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!penduduk || !keperluan.trim() || !pernyataanBenar}
            className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Kirim Permohonan Surat
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
