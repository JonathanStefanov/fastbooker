'use client';

import { useUniversity } from '@/components/UniversityContext';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { university } = useUniversity();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-600 mb-2">An unexpected error occurred while loading this page.</p>
        <p className="text-sm text-gray-400 mb-8 font-mono break-all">{error?.message || 'Unknown error'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { window.location.href = '/'; }} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Go Home
          </button>
          <button onClick={reset} className="px-5 py-2.5 rounded-lg text-white font-medium transition-colors" style={{ backgroundColor: university.colors.primary }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
