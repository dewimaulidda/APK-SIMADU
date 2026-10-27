/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, PengajuanSurat } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { ApplicationForm } from './components/ApplicationForm';
import { TrackingView } from './components/TrackingView';
import { VerificationPortal } from './components/VerificationPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { LetterDocumentView } from './components/LetterDocumentView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'apply' | 'track' | 'verify' | 'admin'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('warga');

  // Active letter preview for printing / PDF export
  const [previewLetter, setPreviewLetter] = useState<PengajuanSurat | null>(null);

  // Navigation parameters
  const [initialJenisId, setInitialJenisId] = useState<string | undefined>(undefined);
  const [trackResi, setTrackResi] = useState<string | undefined>(undefined);
  const [verifyToken, setVerifyToken] = useState<string | undefined>(undefined);

  // Stats for badge
  const [pendingCount, setPendingCount] = useState<number>(0);

  const refreshPendingCount = () => {
    const list = storageService.getPengajuanList();
    const count = list.filter((p) => p.status_surat === 'Pending').length;
    setPendingCount(count);
  };

  useEffect(() => {
    refreshPendingCount();

    // Check URL hash if redirected from QR code link (e.g. #verify?resi=REG-MDS-...)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify')) {
        const params = new URLSearchParams(hash.replace('#verify', '').replace(/^\?/, ''));
        const resi = params.get('resi');
        if (resi) {
          setVerifyToken(resi);
          setActiveTab('verify');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectJenisFromHome = (id_jenis: string) => {
    setInitialJenisId(id_jenis);
    setActiveTab('apply');
  };

  const handleQuickTrack = (resi: string) => {
    setTrackResi(resi);
    setActiveTab('track');
  };

  const handleApplicationSuccess = (newPengajuan: PengajuanSurat) => {
    refreshPendingCount();
  };

  const handleViewLetter = (pengajuan: PengajuanSurat) => {
    setPreviewLetter(pengajuan);
  };

  const handleDirectApplyForResident = (nik: string) => {
    setActiveTab('apply');
    // The application form will allow direct picking
  };

  const handleNavigateToVerification = (resi: string) => {
    setVerifyToken(resi);
    setActiveTab('verify');
  };

  const jenisSuratList = storageService.getJenisSuratList();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Top Bar */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentRole={currentRole}
          setCurrentRole={(role) => {
            setCurrentRole(role);
            if (role !== 'warga') {
              setActiveTab('admin');
            }
          }}
          pendingCount={pendingCount}
        />
      </div>

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <PublicHome
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            jenisSuratList={jenisSuratList}
            onSelectJenis={handleSelectJenisFromHome}
            onQuickTrack={handleQuickTrack}
          />
        )}

        {activeTab === 'apply' && (
          <ApplicationForm
            initialJenisId={initialJenisId}
            onSuccess={handleApplicationSuccess}
            onNavigateToTrack={(resi) => {
              setTrackResi(resi);
              setActiveTab('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'track' && (
          <TrackingView
            initialResi={trackResi}
            onViewLetter={handleViewLetter}
            onNavigateToApply={() => {
              setActiveTab('apply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'verify' && (
          <VerificationPortal
            initialTokenOrResi={verifyToken}
            onViewDocument={handleViewLetter}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentRole={currentRole}
            onViewLetter={handleViewLetter}
            onDirectApplyForResident={handleDirectApplyForResident}
          />
        )}
      </main>

      {/* Official Printable Government Letter Modal */}
      {previewLetter && (
        <LetterDocumentView
          pengajuan={previewLetter}
          onClose={() => setPreviewLetter(null)}
          onNavigateToVerification={handleNavigateToVerification}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
