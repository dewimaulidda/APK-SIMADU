import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, Users, FileText, Search, LayoutDashboard } from 'lucide-react';

interface Props {
  activeTab: 'home' | 'apply' | 'track' | 'verify' | 'admin';
  setActiveTab: (tab: 'home' | 'apply' | 'track' | 'verify' | 'admin') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  pendingCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark with logo */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <img
              src="/src/assets/images/logo_desa_madusari_1793097845420.jpg"
              alt="Logo Desa Madusari"
              className="w-9 h-9 object-contain shrink-0 rounded-full border border-slate-200 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="whitespace-nowrap shrink-0">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                SIMADU
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-1.5 font-medium">
                Desa Madusari
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-700 pb-1 ${
                activeTab === 'home'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Beranda
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-700 pb-1 ${
                activeTab === 'apply'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Buat Surat Mandiri
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-700 pb-1 ${
                activeTab === 'track'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Lacak Berkas
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('verify')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-700 pb-1 ${
                activeTab === 'verify'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Validasi QR
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors hover:text-emerald-700 pb-1 ${
                activeTab === 'admin'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Admin
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-mono font-bold bg-amber-500 text-white rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action / Role switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center text-xs text-slate-500 mr-1">
              <span>Peran:</span>
            </div>
            <select
              aria-label="Pilih Peran Pengguna"
              value={currentRole}
              onChange={(e) => {
                const nextRole = e.target.value as UserRole;
                setCurrentRole(nextRole);
                if (nextRole !== 'warga') {
                  setActiveTab('admin');
                }
              }}
              className="text-xs font-medium px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="warga">Warga (Masyarakat)</option>
              <option value="sekdes">Sekdes (Drs. H. Bambang Subagyo)</option>
              <option value="kaur">Kaur (Siti Rahmawati, S.AP)</option>
            </select>

            {activeTab !== 'apply' ? (
              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                Buat Surat
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                Lacak Resi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white px-2 py-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 ${activeTab === 'home' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Beranda
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`px-2 py-1 ${activeTab === 'apply' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Buat Surat
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`px-2 py-1 ${activeTab === 'track' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Lacak
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-2 py-1 ${activeTab === 'verify' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Validasi
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2 py-1 flex items-center gap-1 ${activeTab === 'admin' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Admin
          {pendingCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>
      </div>
    </header>
  );
};
