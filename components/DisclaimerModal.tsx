'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Modal from './Modal';

export default function DisclaimerModal() {
  const t = useTranslations('disclaimer');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimer-accepted');
    if (!accepted) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setShow(false);
    // Notify UniversityContext that disclaimer was accepted
    window.dispatchEvent(new CustomEvent('disclaimerAccepted'));
  };

  const handleDecline = () => {
    window.location.href = 'https://affluences.com';
  };

  return (
    <Modal open={show} onClose={() => {}} maxWidth="640px" data-testid="disclaimer-modal">
      <div className="py-5 bg-amber-500 text-white">
        <div className="px-6">
          <h2 className="text-lg font-bold">{t('modalTitle')}</h2>
          <p className="text-sm opacity-90 mt-1">{t('notAffiliated')}</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4 text-gray-700">
        <p className="font-semibold">{t('beforeUsing')}</p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>{t('unofficialTool')}</li>
          <li>{t('accountBanned')}</li>
          <li>{t('stopWorking')}</li>
          <li>{t('ownRisk')}</li>
          <li>{t('noWarranty')}</li>
          <li>{t('educationalOnly')}</li>
        </ul>
        <p className="text-sm">{t('educationalPurpose')}</p>
      </div>

      <div className="px-6 pb-5 flex gap-3">
        <button onClick={handleDecline} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          {t('useOfficial')}
        </button>
        <button onClick={handleAccept} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          {t('iUnderstand')}
        </button>
      </div>

      <p className="px-6 pb-4 text-xs text-gray-500 text-center">
        <a href="/disclaimer" className="underline hover:text-gray-700">{t('readFull')}</a>
      </p>
    </Modal>
  );
}
