import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  Calendar,
  User,
  FileText,
  Lock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { PengajuanSurat, Penduduk } from '../types';
import { storageService } from '../services/storageService';
import { VILLAGE_PROFILE } from '../data/initialData';

interface Props {
  initialTokenOrResi?: string;
  onViewDocument: (pengajuan: PengajuanSurat) => void;
}

export const VerificationPortal: React.FC<Props> = ({
  initialTokenOrResi,
  onViewDocument,
}) => {
  const [query, setQuery] = useState(initialTokenOrResi || '');
  const [verifiedDoc, setVerifiedDoc] = useState<PengajuanSurat | null>(null);
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  const allLetters = storageService.getPengajuanList().filter((p) => p.status_surat === 'Selesai');

  useEffect(() => {
    if (initialTokenOrResi) {
      handleVerify(initialTokenOrResi);
    }
  }, [initialTokenOrResi]);

  const handleVerify = (tokenOrResi: string) => {
    const clean = tokenOrResi.trim();
    if (!clean) return;

    setHasVerified(true);
    const list = storageService.getPengajuanList();

    const found = list.find(
      (p) =>
        p.status_surat === 'Selesai' &&
        (p.no_resi.toUpperCase() === clean.toUpperCase() ||
          p.qr_code_token === clean ||
          (p.nomor_surat_resmi && p.nomor_surat_resmi.toLowerCase().includes(clean.toLowerCase())))
    );

    if (found) {
      setVerifiedDoc(found);
      const resident = storageService.findPendudukByNik(found.nik_pemohon);
      setPenduduk(resident || null);
    } else {
      setVerifiedDoc(null);
      setPenduduk(null);
    }
  };

  const jenis = verifiedDoc ? storageService.getJenisSuratById(verifiedDoc.id_jenis) : null;

  // Mask NIK for privacy compliance (UU PDP)
  const maskNik = (nik: string) => {
    if (nik.length < 16) return nik;
    return `${nik.slice(0, 6)}******${nik.slice(12)}`;
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verifikasi Keabsahan Dokumen QR Code
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Portal publik Pemerintah Desa Madusari untuk memverifikasi keaslian tanda tangan digital
          dan legalitas surat dinas yang diterbitkan secara resmi melalui SIMADU.
        </p>
      </div>

      {/* SEARCH / VERIFY BOX */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan Nomor Resi / Nomor Surat Resmi / Scan Token QR..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            Verifikasi Dokumen
          </button>
        </form>

        {/* Demo Fast Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium block mb-2">
            Klik Contoh Surat Sah untuk Menguji Verifikasi:
          </span>
          <div className="flex flex-wrap gap-2">
            {allLetters.map((l) => (
              <button
                key={l.id_pengajuan}
                type="button"
                onClick={() => {
                  setQuery(l.no_resi);
                  handleVerify(l.no_resi);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  verifiedDoc?.no_resi === l.no_resi
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {l.no_resi} · {l.id_jenis.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VERIFIED SUCCESS CARD */}
      {hasVerified && verifiedDoc && penduduk && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-emerald-700 text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Status Legalitas Dokumen
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  DOKUMEN ASLI & TERVERIFIKASI
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Telah diterbitkan secara sah oleh Pemerintah Desa Madusari
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDocument(verifiedDoc)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-emerald-900 text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0"
            >
              <Printer className="w-4 h-4" />
              Buka Pratinjau Asli (PDF)
            </button>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Grid of Verified Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom 1: Legalitas Surat */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Informasi Dokumen Resmi
                </h3>

                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Nomor Surat Dinas:</span>
                    <span className="text-sm font-bold font-mono text-emerald-900">
                      {verifiedDoc.nomor_surat_resmi}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Jenis Surat:</span>
                    <span className="font-semibold text-slate-900">
                      {jenis?.nama_surat || verifiedDoc.id_jenis}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Nomor Resi Pendaftaran:</span>
                    <span className="font-mono text-slate-800">{verifiedDoc.no_resi}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Tanggal Pengesahan:</span>
                    <span className="font-medium text-slate-800">
                      {verifiedDoc.tanggal_disetujui
                        ? new Date(verifiedDoc.tanggal_disetujui).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Pejabat Penandatangan:</span>
                    <span className="font-bold text-slate-900">
                      {verifiedDoc.disetujui_oleh?.nama || VILLAGE_PROFILE.sekretaris_desa.nama}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {verifiedDoc.disetujui_oleh?.jabatan || 'Sekretaris Desa Madusari'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Identitas Pemohon */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Data Pemohon Terdaftar
                </h3>

                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Nama Lengkap Pemohon:</span>
                    <span className="text-sm font-bold text-slate-900 uppercase">
                      {penduduk.nama}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">NIK (Privasi UU PDP):</span>
                    <span className="font-mono font-medium text-slate-800">
                      {maskNik(penduduk.nik)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Wilayah Domisili:</span>
                    <span className="text-slate-800">
                      {penduduk.dusun}, RT {penduduk.rt_rw}, Desa Madusari
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Keperluan Resmi:</span>
                    <span className="text-slate-800 font-medium">{verifiedDoc.keperluan}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Keamanan Kriptografis:</span>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Token: {verifiedDoc.qr_code_token || 'MDS-AUTH-LEGAL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-3">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Catatan Validasi Hukum:</span> Data dokumen
                ini tersinkronisasi secara real-time dengan basis data arsip pelayanan Desa Madusari.
                Dokumen ini sah dan mengikat sesuai Peraturan Menteri Dalam Negeri tentang Tata Naskah
                Dinas di Lingkungan Pemerintah Desa.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOT FOUND */}
      {hasVerified && !verifiedDoc && (
        <div className="bg-white p-8 rounded-2xl border-2 border-rose-300 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-rose-900">
            Dokumen Tidak Ditemukan atau Belum Diterbitkan
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Tidak ditemukan dokumen surat resmi yang sah dengan kode verifikasi atau nomor resi "{query}".
            Harap pastikan kode yang diinput atau di-scan berasal dari surat resmi Desa Madusari.
          </p>
        </div>
      )}
    </div>
  );
};
