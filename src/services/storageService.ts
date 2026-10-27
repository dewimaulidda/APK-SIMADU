import { INITIAL_JENIS_SURAT, INITIAL_PENDUDUK, INITIAL_PENGAJUAN, VILLAGE_PROFILE } from '../data/initialData';
import { DusunName, JenisSurat, Penduduk, PengajuanSurat, StatusSurat } from '../types';

const STORAGE_KEY_PENDUDUK = 'simadu_penduduk_v1';
const STORAGE_KEY_PENGAJUAN = 'simadu_pengajuan_v1';
const STORAGE_KEY_JENIS = 'simadu_jenis_v1';

export const storageService = {
  // PENDUDUK
  getPendudukList(): Penduduk[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PENDUDUK);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PENDUDUK, JSON.stringify(INITIAL_PENDUDUK));
        return INITIAL_PENDUDUK;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PENDUDUK;
    }
  },

  findPendudukByNik(nik: string): Penduduk | undefined {
    const list = this.getPendudukList();
    return list.find((p) => p.nik.trim() === nik.trim());
  },

  savePenduduk(penduduk: Penduduk): void {
    const list = this.getPendudukList();
    const index = list.findIndex((p) => p.nik === penduduk.nik);
    if (index >= 0) {
      list[index] = penduduk;
    } else {
      list.unshift(penduduk);
    }
    localStorage.setItem(STORAGE_KEY_PENDUDUK, JSON.stringify(list));
  },

  deletePenduduk(nik: string): void {
    const list = this.getPendudukList().filter((p) => p.nik !== nik);
    localStorage.setItem(STORAGE_KEY_PENDUDUK, JSON.stringify(list));
  },

  // JENIS SURAT
  getJenisSuratList(): JenisSurat[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_JENIS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_JENIS, JSON.stringify(INITIAL_JENIS_SURAT));
        return INITIAL_JENIS_SURAT;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JENIS_SURAT;
    }
  },

  getJenisSuratById(id: string): JenisSurat | undefined {
    return this.getJenisSuratList().find((j) => j.id_jenis === id);
  },

  // PENGAJUAN SURAT
  getPengajuanList(): PengajuanSurat[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PENGAJUAN);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(INITIAL_PENGAJUAN));
        return INITIAL_PENGAJUAN;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PENGAJUAN;
    }
  },

  findPengajuanById(id: string): PengajuanSurat | undefined {
    return this.getPengajuanList().find((p) => p.id_pengajuan === id);
  },

  findPengajuanByResi(resi: string): PengajuanSurat | undefined {
    const clean = resi.trim().toUpperCase();
    return this.getPengajuanList().find(
      (p) => p.no_resi.toUpperCase() === clean || p.nik_pemohon === clean
    );
  },

  createPengajuan(data: {
    nik_pemohon: string;
    id_jenis: string;
    keperluan: string;
    detail_khusus: Record<string, string>;
  }): PengajuanSurat {
    const list = this.getPengajuanList();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const no_resi = `REG-MDS-${dateStr}-${randomSuffix}`;
    const id_pengajuan = `REQ-${Date.now()}`;

    const newPengajuan: PengajuanSurat = {
      id_pengajuan,
      no_resi,
      nik_pemohon: data.nik_pemohon,
      id_jenis: data.id_jenis,
      keperluan: data.keperluan,
      detail_khusus: data.detail_khusus,
      tanggal_pengajuan: now.toISOString(),
      status_surat: 'Pending',
    };

    list.unshift(newPengajuan);
    localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(list));
    return newPengajuan;
  },

  updateStatus(
    id_pengajuan: string,
    status: StatusSurat,
    options?: {
      catatan?: string;
      approverRole?: 'sekdes' | 'kaur';
      approverName?: string;
    }
  ): PengajuanSurat | undefined {
    const list = this.getPengajuanList();
    const index = list.findIndex((p) => p.id_pengajuan === id_pengajuan);
    if (index === -1) return undefined;

    const current = list[index];
    current.status_surat = status;
    if (options?.catatan !== undefined) {
      current.catatan_petugas = options.catatan;
    }

    if (status === 'Selesai') {
      const now = new Date();
      current.tanggal_disetujui = now.toISOString();

      // Generate official Indonesian municipal letter number if not already generated
      if (!current.nomor_surat_resmi) {
        const jenis = this.getJenisSuratById(current.id_jenis);
        const kode = jenis?.kode_surat || '470';
        const sequenceNumber = String(Math.floor(100 + Math.random() * 899));
        const romanMonth = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][
          now.getMonth()
        ];
        current.nomor_surat_resmi = `${kode}/${sequenceNumber}/429.508/${romanMonth}/${now.getFullYear()}`;
      }

      // Digital signee
      if (!current.disetujui_oleh) {
        if (options?.approverRole === 'sekdes') {
          current.disetujui_oleh = {
            nama: VILLAGE_PROFILE.sekretaris_desa.nama,
            jabatan: VILLAGE_PROFILE.sekretaris_desa.gelar,
            nip: VILLAGE_PROFILE.sekretaris_desa.nip,
          };
        } else {
          current.disetujui_oleh = {
            nama: VILLAGE_PROFILE.kepala_desa.nama,
            jabatan: VILLAGE_PROFILE.kepala_desa.gelar,
          };
        }
      }

      if (!current.qr_code_token) {
        current.qr_code_token = `MDS-${current.id_jenis.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-DIGITAL-SIGN`;
      }
    }

    list[index] = current;
    localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(list));
    return current;
  },

  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEY_PENDUDUK, JSON.stringify(INITIAL_PENDUDUK));
    localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(INITIAL_PENGAJUAN));
    localStorage.setItem(STORAGE_KEY_JENIS, JSON.stringify(INITIAL_JENIS_SURAT));
  },
};
