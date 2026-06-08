'use client';

import { useState, useEffect } from 'react';

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl p-6 max-h-[80vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">⚠️ Important Notice</h2>
        
        <div className="space-y-4 text-gray-700">
          <p className="font-semibold">
            FastBooker is NOT affiliated with Affluences.
          </p>
          
          <p>Before using this application, please understand:</p>
          
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

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Use Official App Instead
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            I Understand, Continue
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          <a href="/disclaimer" className="underline hover:text-gray-700">Read full disclaimer</a>
        </p>
      </div>
    </div>
  );
}
