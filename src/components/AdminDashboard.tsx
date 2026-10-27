import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Printer,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Building,
  RotateCcw,
  BookOpen,
  Filter,
} from 'lucide-react';
import { DusunName, PengajuanSurat, StatusSurat, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { VILLAGE_PROFILE } from '../data/initialData';
import { PopulationManager } from './PopulationManager';

interface Props {
  currentRole: UserRole;
  onViewLetter: (pengajuan: PengajuanSurat) => void;
  onDirectApplyForResident: (nik: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  currentRole,
  onViewLetter,
  onDirectApplyForResident,
}) => {
  const [adminTab, setAdminTab] = useState<'queue' | 'population' | 'registry'>('queue');
  const [pengajuanList, setPengajuanList] = useState<PengajuanSurat[]>(() =>
    storageService.getPengajuanList()
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Approval Modal State
  const [actionItem, setActionItem] = useState<PengajuanSurat | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'process' | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const refreshList = () => {
    setPengajuanList(storageService.getPengajuanList());
  };

  const roleName =
    currentRole === 'sekdes'
      ? `${VILLAGE_PROFILE.sekretaris_desa.nama} (${VILLAGE_PROFILE.sekretaris_desa.gelar})`
      : currentRole === 'kaur'
      ? `${VILLAGE_PROFILE.kaur_pemerintahan.nama} (${VILLAGE_PROFILE.kaur_pemerintahan.gelar})`
      : 'Petugas Administrasi Desa';

  // Stats calculation
  const total = pengajuanList.length;
  const pending = pengajuanList.filter((p) => p.status_surat === 'Pending').length;
  const diproses = pengajuanList.filter((p) => p.status_surat === 'Diproses').length;
  const selesai = pengajuanList.filter((p) => p.status_surat === 'Selesai').length;
  const ditolak = pengajuanList.filter((p) => p.status_surat === 'Ditolak').length;

  // Distribution by letter type
  const jenisCounts: Record<string, number> = {};
  pengajuanList.forEach((p) => {
    jenisCounts[p.id_jenis] = (jenisCounts[p.id_jenis] || 0) + 1;
  });

  // Action handlers
  const handleOpenAction = (item: PengajuanSurat, type: 'approve' | 'reject' | 'process') => {
    setActionItem(item);
    setActionType(type);
    setAdminNote(item.catatan_petugas || '');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem || !actionType) return;

    let targetStatus: StatusSurat = 'Diproses';
    if (actionType === 'approve') targetStatus = 'Selesai';
    if (actionType === 'reject') targetStatus = 'Ditolak';

    storageService.updateStatus(actionItem.id_pengajuan, targetStatus, {
      catatan: adminNote,
      approverRole: currentRole === 'sekdes' ? 'sekdes' : 'kaur',
    });

    refreshList();
    setActionItem(null);
    setActionType(null);
    setAdminNote('');
  };

  const handleResetData = () => {
    if (confirm('Reset ulang data simulasi SIMADU ke setelan awal default?')) {
      storageService.resetDemoData();
      refreshList();
    }
  };

  // Filtered queue
  const filtered = pengajuanList.filter((p) => {
    const pemohon = storageService.findPendudukByNik(p.nik_pemohon);
    const matchesSearch =
      p.no_resi.toLowerCase().includes(search.toLowerCase()) ||
      p.nik_pemohon.includes(search) ||
      (pemohon && pemohon.nama.toLowerCase().includes(search.toLowerCase())) ||
      (p.nomor_surat_resmi && p.nomor_surat_resmi.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status_surat === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            <span>Pemerintah Desa Madusari · Kantor Sekretariat Desa</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Dashboard Verifikasi & Pelayanan Administrasi
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Sedang bertugas:{' '}
            <span className="font-semibold text-slate-900">{roleName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Reset data ke data contoh tugas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data Demo
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY / STAT WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Antrean Masuk Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-amber-700 tabular-nums">
            {pending}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Berkas perlu ditinjau petugas</p>
        </div>

        {/* Sedang Diproses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sedang Diproses
            </span>
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-sky-700 tabular-nums">
            {diproses}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dalam tahap validasi berkas</p>
        </div>

        {/* Selesai & Diterbitkan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Surat Selesai (QR)
            </span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-700 tabular-nums">
            {selesai}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Telah disahkan Sekdes / Kades</p>
        </div>

        {/* Total Arsip Berkas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Permohonan
            </span>
            <span className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {total}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ditolak: {ditolak} berkas</p>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setAdminTab('queue')}
          className={`pb-3 px-3 transition-colors flex items-center gap-1.5 ${
            adminTab === 'queue'
              ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Antrean Permohonan Masuk ({pengajuanList.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('population')}
          className={`pb-3 px-3 transition-colors flex items-center gap-1.5 ${
            adminTab === 'population'
              ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Master Data Kependudukan Desa
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('registry')}
          className={`pb-3 px-3 transition-colors flex items-center gap-1.5 ${
            adminTab === 'registry'
              ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Buku Agenda Surat Keluar ({selesai})
        </button>
      </div>

      {/* TAB 1: ANTREAN PERMOHONAN */}
      {adminTab === 'queue' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Resi, Nama Pemohon, NIK..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({total})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'Pending'
                      ? 'bg-white text-amber-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending ({pending})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Diproses')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'Diproses'
                      ? 'bg-white text-sky-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Diproses ({diproses})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('Selesai')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'Selesai'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Selesai ({selesai})
                </button>
              </div>
            </div>
          </div>

          {/* Table of Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">No. Resi & Tanggal</th>
                    <th className="py-3 px-4">Nama Pemohon & Dusun</th>
                    <th className="py-3 px-4">Jenis Surat</th>
                    <th className="py-3 px-4">Keperluan</th>
                    <th className="py-3 px-4">Status & No. Dinas</th>
                    <th className="py-3 px-4 text-right">Otorisasi & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const pemohon = storageService.findPendudukByNik(item.nik_pemohon);
                    const jenis = storageService.getJenisSuratById(item.id_jenis);

                    return (
                      <tr key={item.id_pengajuan} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{item.no_resi}</div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID')}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 uppercase">
                            {pemohon?.nama || 'Warga'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            NIK: {item.nik_pemohon} · {pemohon?.dusun || '-'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {jenis?.singkatan || item.id_jenis.toUpperCase()}
                          </div>
                          <div className="text-[11px] text-slate-500">{jenis?.nama_surat}</div>
                        </td>

                        <td className="py-3 px-4 max-w-xs text-slate-700">
                          <p className="line-clamp-2">{item.keperluan}</p>
                          {item.catatan_petugas && (
                            <p className="text-[10px] text-amber-700 italic mt-0.5">
                              Catatan: {item.catatan_petugas}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {item.status_surat === 'Selesai' && (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                Selesai
                              </span>
                              <div className="text-[10px] font-mono text-slate-600 mt-1">
                                {item.nomor_surat_resmi}
                              </div>
                            </div>
                          )}
                          {item.status_surat === 'Diproses' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800">
                              Diproses
                            </span>
                          )}
                          {item.status_surat === 'Pending' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          )}
                          {item.status_surat === 'Ditolak' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                              Ditolak
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Tombol Cetak jika sudah selesai */}
                            {item.status_surat === 'Selesai' && (
                              <button
                                type="button"
                                onClick={() => onViewLetter(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition-colors shadow-xs"
                                title="Cetak Format Dokumen Resmi"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                Cetak PDF
                              </button>
                            )}

                            {/* Quick Action Verifikasi / Setujui */}
                            {item.status_surat !== 'Selesai' && (
                              <button
                                type="button"
                                onClick={() => handleOpenAction(item, 'approve')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors"
                                title="Setujui dan Terbitkan Surat"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Setujui & TTD
                              </button>
                            )}

                            {/* Tombol Tolak */}
                            {item.status_surat !== 'Ditolak' && item.status_surat !== 'Selesai' && (
                              <button
                                type="button"
                                onClick={() => handleOpenAction(item, 'reject')}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-xs transition-colors border border-rose-200"
                                title="Tolak Permohonan"
                              >
                                <X className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Tidak ada antrean permohonan yang sesuai filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER DATA KEPENDUDUKAN */}
      {adminTab === 'population' && (
        <PopulationManager onDirectApplyForResident={onDirectApplyForResident} />
      )}

      {/* TAB 3: BUKU AGENDA SURAT KELUAR */}
      {adminTab === 'registry' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Buku Agenda Register Surat Keluar Resmi
              </h2>
              <p className="text-xs text-slate-500">
                Buku nomor urut surat dinas Pemerintah Desa Madusari sesuai format Permendagri No. 47/2016.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Buku Agenda
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Nomor Surat Resmi</th>
                  <th className="py-3 px-4">Tanggal Pengesahan</th>
                  <th className="py-3 px-4">Nama Pemohon (NIK)</th>
                  <th className="py-3 px-4">Perihal / Jenis Surat</th>
                  <th className="py-3 px-4">Penandatangan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {pengajuanList
                  .filter((p) => p.status_surat === 'Selesai')
                  .map((item, idx) => {
                    const pemohon = storageService.findPendudukByNik(item.nik_pemohon);
                    const jenis = storageService.getJenisSuratById(item.id_jenis);
                    return (
                      <tr key={item.id_pengajuan} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          #{String(idx + 1).padStart(3, '0')}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                          {item.nomor_surat_resmi}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {item.tanggal_disetujui
                            ? new Date(item.tanggal_disetujui).toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold uppercase text-slate-900">{pemohon?.nama}</div>
                          <div className="font-mono text-slate-500 text-[11px]">{item.nik_pemohon}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          {jenis?.nama_surat || item.id_jenis.toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {item.disetujui_oleh?.nama || VILLAGE_PROFILE.sekretaris_desa.nama}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onViewLetter(item)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs transition-colors"
                          >
                            Buka Surat
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPROVAL / REJECTION ACTION MODAL */}
      {actionItem && actionType && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {actionType === 'approve'
                  ? 'Konfirmasi Otorisasi & Penerbitan Surat'
                  : 'Tolak Permohonan Surat'}
              </h3>
              <button
                type="button"
                onClick={() => setActionItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Resi:</span>
                  <span className="font-mono font-bold text-slate-900">{actionItem.no_resi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Surat:</span>
                  <span className="font-semibold text-slate-900">
                    {storageService.getJenisSuratById(actionItem.id_jenis)?.nama_surat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemohon:</span>
                  <span className="font-bold uppercase text-slate-900">
                    {storageService.findPendudukByNik(actionItem.nik_pemohon)?.nama}
                  </span>
                </div>
              </div>

              {actionType === 'approve' && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Penerbitan Surat Resmi Desa Madusari</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Sistem akan otomatis mengalokasikan <strong>Nomor Surat Kedinasan</strong>,
                    men-generate <strong>QR Code Keabsahan</strong> ber-token digital, dan mencantumkan
                    tanda tangan resmi atas nama{' '}
                    <strong>
                      {currentRole === 'sekdes'
                        ? VILLAGE_PROFILE.sekretaris_desa.nama
                        : VILLAGE_PROFILE.kepala_desa.nama}
                    </strong>
                    .
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {actionType === 'approve'
                    ? 'Catatan Verifikasi (Opsional):'
                    : 'Alasan / Catatan Penolakan (Wajib Diisi):'}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'reject'}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'Contoh: Berkas fisik telah lengkap dan disurvei kepala dusun.'
                      : 'Contoh: Persyaratan foto usaha belum jelas atau NIK belum terdaftar di RT/RW.'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActionItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-lg font-semibold ${
                    actionType === 'approve'
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  {actionType === 'approve' ? 'Setujui & Terbitkan Surat' : 'Konfirmasi Penolakan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
