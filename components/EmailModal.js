'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useEmail } from './EmailContext';
import { useUniversity } from './UniversityContext';

export default function EmailModal() {
  const { showModal, closeEmailModal, setEmail, email: currentEmail } = useEmail();
  const { university } = useUniversity();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleOpen = () => {
    setInput(currentEmail || '');
    setError('');
  };

  const handleSave = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      setError('Email is required to book seats');
      return;
    }
    if (!trimmed.endsWith(`@${university.emailDomain}`)) {
      setError(`Must be a @${university.emailDomain} address`);
      return;
    }
    setEmail(trimmed);
    closeEmailModal();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <Modal open={showModal} onClose={closeEmailModal} maxWidth="420px">
      <div onTransitionEnd={showModal ? handleOpen : undefined}>
        {/* Header */}
        <div
          className="py-5 text-white"
          style={{ background: university.colors.gradient }}
        >
          <div className="px-6">
            <h2 className="text-lg font-bold">Set Your Email</h2>
            <p className="text-sm opacity-90 mt-1">
              Required to book seats at {university.shortName}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University Email
          </label>
          <input
            type="email"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder={`you@${university.emailDomain}`}
            autoFocus
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900"
            style={{ focusRingColor: university.colors.primary }}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={closeEmailModal}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: university.colors.primary }}
          >
            Save Email
          </button>
        </div>
      </div>
    </Modal>
  );
}
