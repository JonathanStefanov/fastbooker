'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-sm text-gray-600 text-center space-y-2">
          <p>
            ⚠️ <strong>{t('disclaimer').split(':')[0]}:</strong>{' '}
            {t('disclaimer').split(': ').slice(1).join(': ')}
          </p>
          <p className="text-xs">
            <a href="/disclaimer" className="underline hover:text-gray-900 mr-4">{t('fullDisclaimer')}</a>
            <a href="https://github.com/JonathanStefanov/fastbooker" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 mr-4">{t('sourceCode')}</a>
            <a href="https://affluences.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">{t('officialApp')}</a>
          </p>
          <p className="text-xs text-gray-500">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
