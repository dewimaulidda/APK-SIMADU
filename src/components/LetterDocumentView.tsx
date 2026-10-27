import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { Penduduk, PengajuanSurat, VillageProfile } from '../types';
import { storageService } from '../services/storageService';
import { VILLAGE_PROFILE } from '../data/initialData';

interface Props {
  pengajuan: PengajuanSurat;
  penduduk?: Penduduk;
  onClose: () => void;
  onNavigateToVerification?: (resi: string) => void;
}

export const LetterDocumentView: React.FC<Props> = ({
  pengajuan,
  penduduk: propPenduduk,
  onClose,
  onNavigateToVerification,
}) => {
  const penduduk = propPenduduk || storageService.findPendudukByNik(pengajuan.nik_pemohon);
  const jenis = storageService.getJenisSuratById(pengajuan.id_jenis);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const signDate = pengajuan.tanggal_disetujui
    ? new Date(pengajuan.tanggal_disetujui)
    : new Date();

  const formattedDate = signDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Generate QR Code data URL
  useEffect(() => {
    const verificationUrl = `${window.location.origin}/#verify?resi=${pengajuan.no_resi}`;
    QRCode.toDataURL(
      verificationUrl,
      {
        width: 130,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeUrl(url);
        }
      }
    );
  }, [pengajuan.no_resi]);

  const handlePrint = () => {
    window.print();
  };

  if (!penduduk || !jenis) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white p-6 rounded-xl max-w-md w-full text-center">
          <p className="text-rose-600 font-medium">Data pemohon atau jenis surat tidak ditemukan.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const approver = pengajuan.disetujui_oleh || {
    nama: VILLAGE_PROFILE.sekretaris_desa.nama,
    jabatan: VILLAGE_PROFILE.sekretaris_desa.gelar,
    nip: VILLAGE_PROFILE.sekretaris_desa.nip,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex justify-center items-start print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-xl border border-slate-200 print:shadow-none print:border-none print:rounded-none my-auto">
        {/* Top Control Bar - Hidden when printing */}
        <div className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-900 text-white rounded-t-xl border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-base leading-tight">
                Pratinjau Dokumen Surat Resmi
              </h3>
              <p className="text-xs text-slate-400">
                Format Resmi Pemerintah Desa Madusari · No. Resi: {pengajuan.no_resi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToVerification && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToVerification(pengajuan.no_resi);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cek Keabsahan QR
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Container - Standard Indonesian Government A4 Format */}
        <div className="print-container bg-white text-black p-8 md:p-14 text-sm font-serif leading-relaxed min-h-[1100px] select-text">
          {/* KOP SURAT RESMI */}
          <div className="relative border-b-4 border-double border-slate-900 pb-3 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                <img
                  src="/src/assets/images/logo_desa_madusari_1793097845420.jpg"
                  alt="Lambang Desa Madusari"
                  className="w-22 h-22 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 text-center font-sans">
                <h4 className="text-sm font-semibold tracking-widest text-slate-800 uppercase">
                  Pemerintah Kabupaten Banyuwangi
                </h4>
                <h3 className="text-base font-bold tracking-wider text-slate-900 uppercase">
                  Kecamatan Songgon
                </h3>
                <h2 className="text-2xl font-black tracking-wider text-slate-900 uppercase my-0.5">
                  Pemerintah Desa Madusari
                </h2>
                <p className="text-xs text-slate-700 font-normal">
                  {VILLAGE_PROFILE.alamat_kantor} · Kode Pos: {VILLAGE_PROFILE.kode_pos}
                </p>
                <p className="text-[11px] text-slate-600">
                  Telp: {VILLAGE_PROFILE.telepon} · Surel: {VILLAGE_PROFILE.email} · Laman: madusari.desa.id
                </p>
              </div>

              {/* Balancer box for symmetric Kop */}
              <div className="w-20 hidden md:block shrink-0 text-center font-mono text-[9px] text-slate-400">
                <div className="border border-slate-300 p-1 rounded">
                  <div className="font-semibold text-slate-600">SIMADU</div>
                  <div>DESA MANDIRI</div>
                </div>
              </div>
            </div>
          </div>

          {/* JUDUL SURAT */}
          <div className="text-center my-6 font-sans">
            <h1 className="text-lg md:text-xl font-bold uppercase underline tracking-wide text-slate-950">
              {jenis.nama_surat}
            </h1>
            <p className="text-xs font-mono font-medium tracking-tight text-slate-800 mt-1">
              Nomor : {pengajuan.nomor_surat_resmi || `500/---/429.508/X/${new Date().getFullYear()}`}
            </p>
          </div>

          {/* PARAGRAF PEMBUKA */}
          <div className="space-y-4 text-justify font-serif text-[13.5px] leading-relaxed text-slate-900">
            <p className="indent-8">
              Yang bertanda tangan di bawah ini Kepala Desa Madusari, Kecamatan Songgon, Kabupaten Banyuwangi,
              menerangkan dengan sebenarnya bahwa:
            </p>

            {/* TABEL DATA PENDUDUK */}
            <div className="my-3 pl-6 pr-2">
              <table className="w-full border-collapse text-[13px] leading-relaxed font-sans">
                <tbody>
                  <tr className="align-top">
                    <td className="w-48 py-1 text-slate-700">Nama Lengkap</td>
                    <td className="w-4 py-1 text-slate-700">:</td>
                    <td className="py-1 font-bold text-slate-950 uppercase">{penduduk.nama}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Nomor Induk Kependudukan (NIK)</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 font-mono font-semibold text-slate-900">{penduduk.nik}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Nomor Kartu Keluarga (KK)</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 font-mono text-slate-900">{penduduk.no_kk}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Tempat, Tanggal Lahir</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.tempat_tanggal_lahir}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Jenis Kelamin</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.jenis_kelamin}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Kewarganegaraan / Agama</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.kewarganegaraan} / {penduduk.agama}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Status Perkawinan</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.status_perkawinan}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Pekerjaan</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.pekerjaan}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-1 text-slate-700">Alamat Tempat Tinggal</td>
                    <td className="py-1 text-slate-700">:</td>
                    <td className="py-1 text-slate-900">{penduduk.alamat_lengkap}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* KONTEN DETAIL KHUSUS BERDASARKAN JENIS SURAT */}
            {pengajuan.id_jenis === 'sku' && (
              <div className="space-y-2">
                <p className="indent-8">
                  Adalah benar nama yang bersangkutan di atas merupakan warga penduduk Desa Madusari yang
                  memiliki dan menjalankan kegiatan usaha perorangan dengan rincian sebagai berikut:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 pl-5 my-2 font-sans text-[13px]">
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Nama Usaha</span>
                    <span>:</span>
                    <span className="font-bold text-slate-900">{pengajuan.detail_khusus.nama_usaha || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Jenis / Bidang Usaha</span>
                    <span>:</span>
                    <span className="text-slate-900">{pengajuan.detail_khusus.jenis_usaha || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Mulai Beroperasi</span>
                    <span>:</span>
                    <span className="text-slate-900">Tahun {pengajuan.detail_khusus.sejak_tahun || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Lokasi Usaha</span>
                    <span>:</span>
                    <span className="text-slate-900">{pengajuan.detail_khusus.alamat_usaha || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Tujuan Permohonan</span>
                    <span>:</span>
                    <span className="font-medium text-slate-900">{pengajuan.detail_khusus.tujuan_sku || pengajuan.keperluan}</span>
                  </div>
                </div>
              </div>
            )}

            {pengajuan.id_jenis === 'sktm' && (
              <div className="space-y-2">
                <p className="indent-8">
                  Menerangkan dengan sebenarnya bahwa yang bersangkutan adalah benar warga Desa Madusari dan
                  berdasarkan pengamatan riil serta basis data kependudukan desa, keluarga tersebut tergolong dalam
                  kategori <strong>Keluarga Pra-Sejahtera (Tidak Mampu)</strong>.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 pl-5 my-2 font-sans text-[13px]">
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Peruntukan SKTM</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-900">{pengajuan.detail_khusus.peruntukan_sktm || pengajuan.keperluan}</span>
                  </div>
                  {pengajuan.detail_khusus.nama_anak_tanggungan && (
                    <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                      <span className="text-slate-600">Nama Penerima Manfaat</span>
                      <span>:</span>
                      <span className="text-slate-900">{pengajuan.detail_khusus.nama_anak_tanggungan}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-[180px_16px_1fr] gap-1 py-0.5">
                    <span className="text-slate-600">Instansi / Sekolah Tujuan</span>
                    <span>:</span>
                    <span className="text-slate-900">{pengajuan.detail_khusus.nama_sekolah_instansi || '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {pengajuan.id_jenis === 'domisili' && (
              <p className="indent-8">
                Menerangkan bahwa nama tersebut di atas adalah benar-benar bertempat tinggal dan berdomisili
                di wilayah {penduduk.dusun}, RT {penduduk.rt_rw}, Desa Madusari, Kecamatan Songgon sejak{' '}
                <strong>{pengajuan.detail_khusus.lama_tinggal || 'lama'}</strong> dengan status tempat tinggal{' '}
                <strong>{pengajuan.detail_khusus.status_tempat_tinggal || 'Rumah Sendiri'}</strong>.
              </p>
            )}

            {pengajuan.id_jenis === 'skck' && (
              <p className="indent-8">
                Menerangkan bahwa nama tersebut di atas selama menjadi warga Desa Madusari berkelakuan baik,
                tidak sedang tersangkut perkara pidana atau perdata, serta tidak sedang kehilangan hak pilih menurut hukum.
                Surat Pengantar ini diberikan untuk keperluan: <strong>{pengajuan.detail_khusus.tujuan_skck || pengajuan.keperluan}</strong>{' '}
                pada <strong>{pengajuan.detail_khusus.instansi_tujuan || 'Kepolisian Sektor Songgon'}</strong>.
              </p>
            )}

            {pengajuan.id_jenis === 'nikah' && (
              <p className="indent-8">
                Menerangkan bahwa yang bersangkutan berstatus <strong>{penduduk.status_perkawinan}</strong> dan bermaksud
                melangsungkan perkawinan dengan calon pasangan atas nama <strong>{pengajuan.detail_khusus.nama_calon_pasangan || '-'}</strong>,
                warga dari <strong>{pengajuan.detail_khusus.asal_calon_pasangan || '-'}</strong> pada perkiraan tanggal{' '}
                <strong>{pengajuan.detail_khusus.rencana_tanggal_nikah || 'waktu terdekat'}</strong>.
              </p>
            )}

            {pengajuan.id_jenis === 'keterangan_umum' && (
              <p className="indent-8">
                Menerangkan dengan sebenarnya bahwa yang bersangkutan hingga saat surat ini diterbitkan berstatus{' '}
                <strong>{penduduk.status_perkawinan}</strong> dan surat ini dibuat untuk keperluan:{' '}
                <strong>{pengajuan.keperluan}</strong> yang ditujukan kepada <strong>{pengajuan.detail_khusus.instansi_penerima || 'Instansi Terkait'}</strong>.
              </p>
            )}

            {/* KEPERLUAN UMUM JIKA DITULIS */}
            <p className="indent-8">
              Surat Keterangan ini diterbitkan atas permohonan yang bersangkutan untuk keperluan:{' '}
              <span className="font-semibold">{pengajuan.keperluan}</span>.
            </p>

            {/* PARAGRAF PENUTUP */}
            <p className="indent-8">
              Demikian Surat Keterangan ini dibuat dengan sebenarnya dan penuh rasa tanggung jawab agar dapat
              dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
            </p>
          </div>

          {/* BAGIAN TANDA TANGAN, STEMPEL & QR CODE */}
          <div className="mt-8 pt-4 grid grid-cols-2 gap-8 items-end font-sans">
            {/* Bagian Kiri: Verifikasi Keabsahan & QR Code */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code Keabsahan Surat"
                  className="w-20 h-20 bg-white p-1 rounded border border-slate-300 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-200 rounded flex items-center justify-center text-[10px] text-slate-500">
                  QR Code
                </div>
              )}
              <div className="text-[11px] leading-tight space-y-1 text-slate-700">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  DOKUMEN SAH & TERVERIFIKASI
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Token: {pengajuan.qr_code_token || 'MDS-AUTH-LEGAL'}
                </div>
                <div className="text-[10px] text-slate-600">
                  Scan QR Code untuk verifikasi keaslian dokumen pada sistem SIMADU Desa Madusari.
                </div>
              </div>
            </div>

            {/* Bagian Kanan: Titi Mangsa & Tanda Tangan Pejabat */}
            <div className="text-center font-sans text-[13px] relative">
              <p className="text-slate-800 mb-1">
                Madusari, {formattedDate}
              </p>
              <p className="font-semibold text-slate-900 leading-tight">
                {approver.jabatan.includes('Sekretaris') ? (
                  <>
                    a.n. KEPALA DESA MADUSARI
                    <br />
                    <span className="font-bold">SEKRETARIS DESA,</span>
                  </>
                ) : (
                  <span className="font-bold">KEPALA DESA MADUSARI,</span>
                )}
              </p>

              {/* Stempel Digital Desa Madusari & Tanda Tangan */}
              <div className="relative h-24 my-1 flex items-center justify-center">
                {/* Visual Stempel Basah (Circular Stamp) */}
                <div className="absolute -left-2 top-0 pointer-events-none opacity-80 rotate-[-8deg]">
                  <div className="w-24 h-24 rounded-full border-2 border-indigo-700 p-1 flex items-center justify-center text-center">
                    <div className="w-full h-full rounded-full border border-dashed border-indigo-700 flex flex-col items-center justify-center text-[8px] font-black uppercase text-indigo-700 leading-none tracking-tight">
                      <span>PEMERINTAH DESA</span>
                      <span className="my-0.5 text-[9px] font-bold">★ MADUSARI ★</span>
                      <span>KEC. SONGGON</span>
                    </div>
                  </div>
                </div>

                {/* Tanda Tangan Stylized Line */}
                <div className="font-serif italic font-bold text-slate-800 text-lg opacity-80 z-10 select-none">
                  ( {approver.nama} )
                </div>
              </div>

              {/* Nama Pejabat & NIP */}
              <div className="leading-tight">
                <p className="font-bold text-slate-950 uppercase underline">
                  {approver.nama}
                </p>
                {approver.nip && (
                  <p className="text-[11px] font-mono text-slate-700 mt-0.5">
                    NIP. {approver.nip}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in modal - hidden in print */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 rounded-b-xl flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>
            Tips Ujian: Klik tombol <strong>Cetak / Simpan PDF</strong> untuk mengekspor dokumen ke format PDF resmi ukuran A4 siap setor.
          </span>
          <span className="font-mono text-slate-600">SIMADU v1.0 · Desa Madusari</span>
        </div>
      </div>
    </div>
  );
};
