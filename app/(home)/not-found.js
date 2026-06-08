'use client';

import { useUniversity } from '@/components/UniversityContext';

export default function NotFound() {
  const { university } = useUniversity();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-5 py-2.5 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: university.colors.primary }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
