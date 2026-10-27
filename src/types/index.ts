export type UserRole = 'warga' | 'sekdes' | 'kaur';

export type DusunName = 'Dusun Krajan' | 'Dusun Sidomulyo' | 'Dusun Sumberasri' | 'Dusun Sukorejo';

export interface Penduduk {
  nik: string;
  nama: string;
  no_kk: string;
  dusun: DusunName;
  rt_rw: string;
  tempat_tanggal_lahir: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  status_perkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pekerjaan: string;
  kewarganegaraan: string;
  status_ekonomi: 'Mampu' | 'Pra-Sejahtera';
  alamat_lengkap: string;
}

export type StatusSurat = 'Pending' | 'Diproses' | 'Selesai' | 'Ditolak';

export interface JenisSurat {
  id_jenis: string;
  kode_surat: string;
  nama_surat: string;
  singkatan: string;
  deskripsi: string;
  persyaratan: string[];
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select';
    placeholder?: string;
    options?: string[];
    required?: boolean;
    helper?: string;
  }[];
}

export interface PengajuanSurat {
  id_pengajuan: string;
  no_resi: string;
  nik_pemohon: string;
  id_jenis: string;
  keperluan: string;
  detail_khusus: Record<string, string>;
  tanggal_pengajuan: string; // ISO string or YYYY-MM-DD
  status_surat: StatusSurat;
  nomor_surat_resmi?: string;
  tanggal_disetujui?: string;
  disetujui_oleh?: {
    nama: string;
    jabatan: string;
    nip?: string;
  };
  catatan_petugas?: string;
  qr_code_token?: string;
}

export interface VillageProfile {
  nama_desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  alamat_kantor: string;
  telepon: string;
  email: string;
  website: string;
  kepala_desa: {
    nama: string;
    nip?: string;
    gelar: string;
  };
  sekretaris_desa: {
    nama: string;
    nip: string;
    gelar: string;
  };
  kaur_pemerintahan: {
    nama: string;
    nip: string;
    gelar: string;
  };
}
