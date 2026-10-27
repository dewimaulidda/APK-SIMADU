import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  MapPin,
  FileText,
  Briefcase,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { DusunName, Penduduk } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  onDirectApplyForResident: (nik: string) => void;
}

export const PopulationManager: React.FC<Props> = ({ onDirectApplyForResident }) => {
  const [pendudukList, setPendudukList] = useState<Penduduk[]>(() =>
    storageService.getPendudukList()
  );
  const [search, setSearch] = useState('');
  const [filterDusun, setFilterDusun] = useState<string>('all');
  const [filterEkonomi, setFilterEkonomi] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNik, setEditingNik] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Penduduk>({
    nik: '',
    nama: '',
    no_kk: '',
    dusun: 'Dusun Krajan',
    rt_rw: '001/001',
    tempat_tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
    agama: 'Islam',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: 'Wiraswasta',
    kewarganegaraan: 'WNI',
    status_ekonomi: 'Mampu',
    alamat_lengkap: '',
  });

  const refreshList = () => {
    setPendudukList(storageService.getPendudukList());
  };

  const handleOpenAdd = () => {
    setEditingNik(null);
    setFormData({
      nik: `351004${Math.floor(1000000000 + Math.random() * 9000000000)}`.slice(0, 16),
      nama: '',
      no_kk: `351004${Math.floor(1000000000 + Math.random() * 9000000000)}`.slice(0, 16),
      dusun: 'Dusun Krajan',
      rt_rw: '001/001',
      tempat_tanggal_lahir: 'Banyuwangi, 01 Januari 1995',
      jenis_kelamin: 'Laki-laki',
      agama: 'Islam',
      status_perkawinan: 'Belum Kawin',
      pekerjaan: 'Wiraswasta',
      kewarganegaraan: 'WNI',
      status_ekonomi: 'Mampu',
      alamat_lengkap: 'Desa Madusari, Kec. Songgon',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Penduduk) => {
    setEditingNik(p.nik);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = (nik: string, nama: string) => {
    if (confirm(`Yakin ingin menghapus data warga ${nama}?`)) {
      storageService.deletePenduduk(nik);
      refreshList();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nik || !formData.nama) return;

    storageService.savePenduduk(formData);
    refreshList();
    setIsModalOpen(false);
  };

  // Filtered List
  const filtered = pendudukList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search) ||
      p.pekerjaan.toLowerCase().includes(search.toLowerCase());

    const matchesDusun = filterDusun === 'all' || p.dusun === filterDusun;
    const matchesEkonomi = filterEkonomi === 'all' || p.status_ekonomi === filterEkonomi;

    return matchesSearch && matchesDusun && matchesEkonomi;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Master Data Kependudukan Desa Madusari
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Kelola basis data penduduk untuk verifikasi otomatis pembuatan surat administrasi desa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Warga Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama, NIK, Pekerjaan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            aria-label="Filter Dusun"
            value={filterDusun}
            onChange={(e) => setFilterDusun(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none"
          >
            <option value="all">Semua Dusun (4 Dusun)</option>
            <option value="Dusun Krajan">Dusun Krajan</option>
            <option value="Dusun Sidomulyo">Dusun Sidomulyo</option>
            <option value="Dusun Sumberasri">Dusun Sumberasri</option>
            <option value="Dusun Sukorejo">Dusun Sukorejo</option>
          </select>

          <select
            aria-label="Filter Status Ekonomi"
            value={filterEkonomi}
            onChange={(e) => setFilterEkonomi(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none"
          >
            <option value="all">Semua Status Ekonomi</option>
            <option value="Mampu">Ekonomi Mampu</option>
            <option value="Pra-Sejahtera">Pra-Sejahtera</option>
          </select>

          <span className="text-xs font-mono text-slate-500 ml-2">
            Total: {filtered.length} Warga
          </span>
        </div>
      </div>

      {/* Population Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NIK</th>
                <th className="py-3 px-4">Wilayah Dusun & RT/RW</th>
                <th className="py-3 px-4">Tempat, Tanggal Lahir</th>
                <th className="py-3 px-4">Pekerjaan</th>
                <th className="py-3 px-4">Status Ekonomi</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.nik} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 uppercase">{p.nama}</div>
                    <div className="font-mono text-slate-500 text-[11px]">{p.nik}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium">{p.dusun}</div>
                    <div className="text-[11px] text-slate-500">RT {p.rt_rw}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{p.tempat_tanggal_lahir}</div>
                    <div className="text-[11px] text-slate-500">{p.jenis_kelamin}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{p.pekerjaan}</div>
                    <div className="text-[11px] text-slate-500">{p.status_perkawinan}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        p.status_ekonomi === 'Pra-Sejahtera'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {p.status_ekonomi}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDirectApplyForResident(p.nik)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded border border-emerald-200 transition-colors"
                        title="Buatkan surat untuk warga ini"
                      >
                        <FileText className="w-3 h-3 inline mr-1" />
                        Buatkan Surat
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Edit Data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(p.nik, p.nama)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada data warga yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT WARGA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingNik ? 'Edit Data Warga Desa' : 'Tambah Data Penduduk Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIK (16 Digit) *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Kartu Keluarga (KK) *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={formData.no_kk}
                    onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wilayah Dusun</label>
                  <select
                    value={formData.dusun}
                    onChange={(e) =>
                      setFormData({ ...formData, dusun: e.target.value as DusunName })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Dusun Krajan">Dusun Krajan</option>
                    <option value="Dusun Sidomulyo">Dusun Sidomulyo</option>
                    <option value="Dusun Sumberasri">Dusun Sumberasri</option>
                    <option value="Dusun Sukorejo">Dusun Sukorejo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RT / RW</label>
                  <input
                    type="text"
                    value={formData.rt_rw}
                    onChange={(e) => setFormData({ ...formData, rt_rw: e.target.value })}
                    placeholder="002/001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tempat, Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={formData.tempat_tanggal_lahir}
                    onChange={(e) =>
                      setFormData({ ...formData, tempat_tanggal_lahir: e.target.value })
                    }
                    placeholder="Banyuwangi, 14 Mei 1990"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenis_kelamin: e.target.value as 'Laki-laki' | 'Perempuan',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Ekonomi</label>
                  <select
                    value={formData.status_ekonomi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status_ekonomi: e.target.value as 'Mampu' | 'Pra-Sejahtera',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Mampu">Mampu</option>
                    <option value="Pra-Sejahtera">Pra-Sejahtera (Kurang Mampu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={formData.alamat_lengkap}
                  onChange={(e) => setFormData({ ...formData, alamat_lengkap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
