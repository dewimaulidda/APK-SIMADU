import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Printer,
  ShieldCheck,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  XCircle,
} from 'lucide-react';
import { PengajuanSurat, Penduduk, StatusSurat } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  initialResi?: string;
  onViewLetter: (pengajuan: PengajuanSurat) => void;
  onNavigateToApply: () => void;
}

export const TrackingView: React.FC<Props> = ({
  initialResi,
  onViewLetter,
  onNavigateToApply,
}) => {
  const [searchInput, setSearchInput] = useState(initialResi || '');
  const [searchResult, setSearchResult] = useState<PengajuanSurat | null>(null);
  const [pemohon, setPemohon] = useState<Penduduk | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [allPengajuan, setAllPengajuan] = useState<PengajuanSurat[]>([]);

  useEffect(() => {
    setAllPengajuan(storageService.getPengajuanList());
  }, []);

  useEffect(() => {
    if (initialResi) {
      handleSearch(initialResi);
    }
  }, [initialResi]);

  const handleSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) return;

    setHasSearched(true);
    const found = storageService.findPengajuanByResi(clean);
    if (found) {
      setSearchResult(found);
      const resident = storageService.findPendudukByNik(found.nik_pemohon);
      setPemohon(resident || null);
    } else {
      setSearchResult(null);
      setPemohon(null);
    }
  };

  const getStepStatus = (
    currentStatus: StatusSurat,
    stepIndex: number
  ): 'complete' | 'active' | 'upcoming' | 'rejected' => {
    if (currentStatus === 'Ditolak') {
      return stepIndex === 1 ? 'complete' : 'rejected';
    }

    const statusOrder: Record<StatusSurat, number> = {
      Pending: 1,
      Diproses: 2,
      Selesai: 4,
      Ditolak: 0,
    };

    const currentOrder = statusOrder[currentStatus] || 1;

    if (currentOrder > stepIndex) return 'complete';
    if (currentOrder === stepIndex) return 'active';
    return 'upcoming';
  };

  const jenis = searchResult
    ? storageService.getJenisSuratById(searchResult.id_jenis)
    : null;

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 sm:px-6">
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
          Layanan Mandiri Warga
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Lacak Posisi Berkas Pengajuan Surat
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Pantau progres pembuatan surat Anda secara transparan menggunakan Nomor Resi atau NIK Pemohon.
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchInput);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Masukkan Nomor Resi (misal: REG-MDS-20261026-001) atau NIK Pemohon..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            Lacak Berkas
          </button>
        </form>

        {/* Quick Click Demo Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium block mb-2">
            Klik Contoh Nomor Resi untuk Cek Langsung:
          </span>
          <div className="flex flex-wrap gap-2">
            {allPengajuan.map((p) => (
              <button
                key={p.id_pengajuan}
                type="button"
                onClick={() => {
                  setSearchInput(p.no_resi);
                  handleSearch(p.no_resi);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  searchResult?.no_resi === p.no_resi
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {p.no_resi} ({p.status_surat})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH RESULT DETAILS */}
      {hasSearched && searchResult && pemohon && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase">
                    Resi: {searchResult.no_resi}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    Diajukan: {new Date(searchResult.tanggal_pengajuan).toLocaleString('id-ID')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {jenis?.nama_surat || 'Surat Administrasi'}
                </h2>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto">
                {searchResult.status_surat === 'Selesai' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Surat Selesai & Diterbitkan
                  </span>
                )}
                {searchResult.status_surat === 'Diproses' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg border border-sky-200">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Sedang Diproses Verifikasi
                  </span>
                )}
                {searchResult.status_surat === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Menunggu Pemeriksaan
                  </span>
                )}
                {searchResult.status_surat === 'Ditolak' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-200">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Permohonan Ditolak
                  </span>
                )}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-8 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                Tahapan Proses Berkas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      getStepStatus(searchResult.status_surat, 1) === 'complete'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">1. Pengajuan Masuk</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Warga input via SIMADU</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      getStepStatus(searchResult.status_surat, 2) === 'complete'
                        ? 'bg-emerald-600 text-white'
                        : getStepStatus(searchResult.status_surat, 2) === 'active'
                        ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {getStepStatus(searchResult.status_surat, 2) === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      '2'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">2. Verifikasi Berkas</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Kaur Pemerintahan Desa</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      getStepStatus(searchResult.status_surat, 3) === 'complete'
                        ? 'bg-emerald-600 text-white'
                        : getStepStatus(searchResult.status_surat, 3) === 'active'
                        ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {getStepStatus(searchResult.status_surat, 3) === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      '3'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">3. Otorisasi & TTD</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sekdes / Kades Madusari</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      getStepStatus(searchResult.status_surat, 4) === 'complete'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {getStepStatus(searchResult.status_surat, 4) === 'complete' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      '4'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">4. Terbit Resmi (QR)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Siap Cetak / Unduh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pemohon data & Keperluan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 text-xs">
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-500 uppercase tracking-wider block">
                  Data Pemohon Warga:
                </span>
                <p className="font-bold text-sm text-slate-900 uppercase">{pemohon.nama}</p>
                <p className="text-slate-600 font-mono">NIK: {pemohon.nik}</p>
                <p className="text-slate-600">
                  {pemohon.dusun} · RT {pemohon.rt_rw}
                </p>
                <p className="text-slate-600">Pekerjaan: {pemohon.pekerjaan}</p>
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-500 uppercase tracking-wider block">
                  Keperluan Permohonan:
                </span>
                <p className="text-slate-800 font-medium">{searchResult.keperluan}</p>
                {searchResult.catatan_petugas && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-700 block">Catatan Perangkat Desa:</span>
                    <p className="text-slate-600 italic">"{searchResult.catatan_petugas}"</p>
                  </div>
                )}
                {searchResult.nomor_surat_resmi && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-700 block">Nomor Surat Dinas:</span>
                    <p className="font-mono font-bold text-emerald-800">{searchResult.nomor_surat_resmi}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION FOOTER */}
            {searchResult.status_surat === 'Selesai' ? (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Surat Telah Diterbitkan & Sah Secara Hukum
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Dilengkapi Kop Resmi Pemerintah Desa Madusari dan QR Code keabsahan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewLetter(searchResult)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  Lihat & Cetak PDF Resmi
                </button>
              </div>
            ) : searchResult.status_surat === 'Ditolak' ? (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-rose-950">
                    Permohonan Perlu Dilengkapi / Ditolak
                  </h4>
                  <p className="text-xs text-rose-800">
                    Silakan periksa catatan di atas atau lakukan pengajuan ulang berkas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToApply}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Ajukan Ulang Surat
                </button>
              </div>
            ) : (
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Berkas sedang dalam antrean pelayanan. Jam operasional verifikasi: 08:00 - 15:30 WIB.
                </span>
                <span className="font-mono text-slate-500">Estimasi: ±15 Menit</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOT FOUND */}
      {hasSearched && !searchResult && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            Berkas Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Tidak ditemukan permohonan dengan Nomor Resi atau NIK "{searchInput}".
            Pastikan nomor yang dimasukkan sudah sesuai dengan bukti tanda terima.
          </p>
        </div>
      )}
    </div>
  );
};
