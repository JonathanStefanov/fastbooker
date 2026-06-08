'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimer-accepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://affluences.com';
  };

  return (
    <Modal open={show} onClose={() => {}} maxWidth="640px">
      {/* Header */}
      <div className="py-5 bg-amber-500 text-white">
        <div className="px-6">
          <h2 className="text-lg font-bold">⚠️ Important Notice</h2>
          <p className="text-sm opacity-90 mt-1">FastBooker is NOT affiliated with Affluences</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4 text-gray-700">
        <p className="font-semibold">Before using this application, please understand:</p>

        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>This is an <strong>unofficial tool</strong> that may violate Affluences&apos; Terms of Service</li>
          <li>Your Affluences account could be <strong>suspended or banned</strong></li>
          <li>This service may <strong>stop working at any time</strong></li>
          <li>You use this tool <strong>at your own risk</strong></li>
          <li>No warranty or guarantee is provided</li>
          <li>This is for <strong>educational and personal use only</strong></li>
        </ul>

        <p className="text-sm">
          This project was created for educational purposes. By continuing, you accept
          full responsibility for any consequences.
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 flex gap-3">
        <button
          onClick={handleDecline}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Use Official App
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          I Understand
        </button>
      </div>

      <p className="px-6 pb-4 text-xs text-gray-500 text-center">
        <a href="/disclaimer" className="underline hover:text-gray-700">Read full disclaimer</a>
      </p>
    </Modal>
  );
}
