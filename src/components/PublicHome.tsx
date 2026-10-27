import React from 'react';
import {
  FileText,
  Search,
  QrCode,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  MapPin,
  Building,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { JenisSurat } from '../types';

interface Props {
  onNavigate: (tab: 'home' | 'apply' | 'track' | 'verify' | 'admin') => void;
  jenisSuratList: JenisSurat[];
  onSelectJenis: (id_jenis: string) => void;
  onQuickTrack: (resi: string) => void;
}

export const PublicHome: React.FC<Props> = ({
  onNavigate,
  jenisSuratList,
  onSelectJenis,
  onQuickTrack,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-slate-800 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/desa_madusari_hero_1793097846377.jpg"
            alt="Pemandangan Balai Desa Madusari"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30">
              <Building className="w-3.5 h-3.5" />
              <span>Pemerintah Desa Madusari · Kec. Songgon · Kab. Banyuwangi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Pelayanan Administrasi Surat Mandiri & Cepat
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Selamat datang di <strong>SIMADU</strong>. Layanan permohonan surat administrasi warga Desa Madusari
              secara mandiri tanpa antre lama di kantor desa. Data kependudukan otomatis terisi, verifikasi cepat,
              dan terbit dengan QR Code resmi.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('apply')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/30"
              >
                <FileText className="w-4 h-4" />
                Mulai Buat Surat Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('track')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-colors border border-slate-700"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                Lacak Status Berkas
              </button>
            </div>

            {/* Quick Demo Shortcuts for Evaluator/Dosen */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                Pintasan Pengujian Cepat (Demo Dosen/Penguji):
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onQuickTrack('REG-MDS-20261026-001')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 font-mono transition-colors"
                  title="Lihat contoh surat SKU yang sudah selesai & siap dicetak"
                >
                  Resi SKU Selesai (REG-MDS-20261026-001) →
                </button>
                <button
                  type="button"
                  onClick={() => onQuickTrack('REG-MDS-20261026-002')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 font-mono transition-colors"
                  title="Lihat contoh surat SKTM yang sudah disetujui Kades"
                >
                  Resi SKTM Selesai (REG-MDS-20261026-002) →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 transition-colors"
                >
                  Buka Dashboard Sekdes / Kaur →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STATS & BENEFIT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="p-4 border-r border-slate-100 last:border-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Wilayah Dusun
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">4</span>
              <span className="text-xs text-slate-500">Dusun Aktif</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Krajan, Sidomulyo, Sumberasri, Sukorejo</p>
          </div>

          <div className="p-4 border-r border-slate-100 last:border-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Basis Data Warga
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">100%</span>
              <span className="text-xs text-slate-500">Auto-Detect NIK</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Bebas ketik ulang biodata kependudukan</p>
          </div>

          <div className="p-4 border-r border-slate-100 last:border-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Waktu Pelayanan
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">± 15</span>
              <span className="text-xs text-slate-500">Menit Rata-rata</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Proses verifikasi & tanda tangan digital</p>
          </div>

          <div className="p-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Biaya Administrasi
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">Rp 0,-</span>
              <span className="text-xs text-slate-500">Gratis Total</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pelayanan masyarakat Desa Madusari</p>
          </div>
        </div>
      </section>

      {/* 3 STEP INTEGRATED WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Alur Kerja Pelayanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            3 Langkah Mudah Urus Surat di Desa Madusari
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            SIMADU memangkas birokrasi berbelit. Semua terhubung langsung dengan basis data kependudukan desa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono flex items-center justify-center text-base mb-4">
              01
            </div>
            <h3 className="font-semibold text-base text-slate-900 mb-2">
              Input NIK & Pilih Surat
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Warga cukup mengetikkan 16 digit NIK. Sistem otomatis menarik nama, Dusun, RT/RW, dan tempat tanggal lahir
              sehingga terhindar dari salah ketik.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 font-bold font-mono flex items-center justify-center text-base mb-4">
              02
            </div>
            <h3 className="font-semibold text-base text-slate-900 mb-2">
              Verifikasi Sekdes & Kaur
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Perangkat Desa menerima notifikasi surat masuk di dashboard admin, memvalidasi berkas, dan membubuhkan
              persetujuan resmi serta nomor surat dinas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold font-mono flex items-center justify-center text-base mb-4">
              03
            </div>
            <h3 className="font-semibold text-base text-slate-900 mb-2">
              Penerbitan Dokumen & QR Code
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Surat otomatis terbit dalam format PDF resmi ber-KOP Pemerintah Desa Madusari lengkap dengan QR Code
              keabsahan yang dapat di-scan oleh pihak manapun.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR LETTER TYPES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Katalog Surat Mandiri
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Jenis Surat Administrasi yang Tersedia
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pilih langsung jenis surat yang Anda butuhkan untuk memulai pengisian formulir mandiri.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('apply')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap"
          >
            Buka Formulir Pengajuan
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jenisSuratList.map((j) => (
            <div
              key={j.id_jenis}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md font-mono">
                    Kode {j.kode_surat}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{j.singkatan}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                  {j.nama_surat}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {j.deskripsi}
                </p>

                <div className="space-y-1 mb-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Persyaratan:
                  </span>
                  {j.persyaratan.slice(0, 2).map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectJenis(j.id_jenis);
                  onNavigate('apply');
                }}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                Ajukan Surat Ini
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIKASI QR CODE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-10 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Keamanan Dokumen Digital</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Cek & Verifikasi Keaslian Surat Ber-QR Code
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Menerima surat fisik ber-KOP Desa Madusari? Perbankan, instansi kepolisian, atau pihak sekolah dapat
              memverifikasi keaslian tanda tangan digital dan nomor surat secara instan di portal publik SIMADU.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('verify')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              Buka Portal Validasi QR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
