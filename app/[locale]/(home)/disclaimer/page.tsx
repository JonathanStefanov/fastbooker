import { getTranslations } from 'next-intl/server';

export default async function DisclaimerPage() {
  const t = await getTranslations('disclaimerPage');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{t('title')}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('notAffiliatedTitle')}</h2>
          <p className="text-gray-700"><strong>{t('notAffiliatedBold')}</strong></p>
          <p className="text-gray-700">{t('notAffiliatedDesc')}</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('useAtOwnRiskTitle')}</h2>
          <p className="text-gray-700">{t('useAtOwnRiskDesc')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{t('potentialRisksTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Terms of Service Violations:</strong> {t('tosViolation')}</li>
            <li><strong>Account Suspension:</strong> {t('accountSuspension')}</li>
            <li><strong>Service Interruption:</strong> {t('serviceInterruption')}</li>
            <li><strong>No Warranty:</strong> {t('noWarrantyItem')}</li>
            <li><strong>Legal Consequences:</strong> {t('legalConsequences')}</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{t('yourResponsibilitiesTitle')}</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>{t('resp1')}</li><li>{t('resp2')}</li><li>{t('resp3')}</li><li>{t('resp4')}</li><li>{t('resp5')}</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('educationalTitle')}</h2>
          <p className="text-gray-700">{t('eduCreated')}</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>{t('eduPurpose1')}</li><li>{t('eduPurpose2')}</li><li>{t('eduPurpose3')}</li><li>{t('eduPurpose4')}</li>
          </ul>
          <p className="text-gray-700 mt-3">{t('eduNotIntended')}</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>{t('eduNot1')}</li><li>{t('eduNot2')}</li><li>{t('eduNot3')}</li><li>{t('eduNot4')}</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('ethicalTitle')}</h2>
          <p className="text-gray-700">{t('ethicalDesc')}</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>{t('ethical1')}</li><li>{t('ethical2')}</li><li>{t('ethical3')}</li><li>{t('ethical4')}</li><li>{t('ethical5')}</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('contactTitle')}</h2>
          <p className="text-gray-700"><strong>{t('contactAffluences')}</strong></p>
          <p className="text-gray-700 mt-2"><strong>{t('contactUsers')}</strong></p>
        </section>
        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">{t('noWarrantyTitle')}</h2>
          <p className="text-gray-600 text-sm">{t('noWarrantyText')}</p>
        </section>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">{t('lastUpdated')}</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{t('backToHome')}</a>
            <a href="https://affluences.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">{t('visitOfficial')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
