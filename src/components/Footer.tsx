import React from 'react';
import { VILLAGE_PROFILE } from '../data/initialData';
import { Building2, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  onNavigate: (tab: 'home' | 'apply' | 'track' | 'verify' | 'admin') => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/src/assets/images/logo_desa_madusari_1793097845420.jpg"
                alt="Logo Desa Madusari"
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-white text-base leading-none">SIMADU</h4>
                <p className="text-xs text-slate-400 mt-1">Desa Madusari, Songgon</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Informasi Pelayanan Administrasi Desa Madusari. Menghadirkan pelayanan surat menyurat mandiri,
              cepat, transparan, dan terintegrasi QR Code resmi.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Standar Tata Naskah Dinas Permendagri</span>
            </div>
          </div>

          {/* Col 2: Village Office info */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-sm">Kantor Kepala Desa</h5>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{VILLAGE_PROFILE.alamat_kantor}, Songgon, Banyuwangi 68463</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{VILLAGE_PROFILE.telepon}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{VILLAGE_PROFILE.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Senin - Jumat: 08.00 - 15.30 WIB</span>
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-sm">Layanan Mandiri</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('apply')}
                  className="hover:text-white transition-colors"
                >
                  Permohonan Surat Keterangan Usaha (SKU)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('apply')}
                  className="hover:text-white transition-colors"
                >
                  Surat Keterangan Tidak Mampu (SKTM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('apply')}
                  className="hover:text-white transition-colors"
                >
                  Surat Keterangan Domisili Warga
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('apply')}
                  className="hover:text-white transition-colors"
                >
                  Surat Pengantar SKCK & Nikah (N-1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors"
                >
                  Lacak Resi Pengajuan Surat
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Dusun Wilayah & Academic Note */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-sm">Wilayah Dusun Desa Madusari</h5>
            <div className="text-xs text-slate-400 space-y-1">
              <p>• Dusun Krajan (Pusat Pemerintahan)</p>
              <p>• Dusun Sidomulyo (Pertanian & UMKM)</p>
              <p>• Dusun Sumberasri (Perkebunan & Ternak)</p>
              <p>• Dusun Sukorejo (Kawasan Sentra Kerajinan)</p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block border-t border-slate-800 pt-2">
                Dirancang untuk implementasi tugas akademik Sistem Informasi Pemerintahan Desa.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Pemerintah Desa Madusari. Seluruh Hak Dilindungi.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Kecamatan Songgon</span>
            <span>·</span>
            <span>Kabupaten Banyuwangi</span>
            <span>·</span>
            <span>Jawa Timur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
