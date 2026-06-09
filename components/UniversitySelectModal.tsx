'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useUniversity } from './UniversityContext';
import { getUniversitiesByCountry } from '@/lib/universities';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import type { University } from '@/types';

const COUNTRY_NAMES: Record<string, string> = {
  BE: 'Belgium',
  CH: 'Switzerland',
  FR: 'France',
  IT: 'Italy',
  DE: 'Germany',
  LU: 'Luxembourg',
  ES: 'Spain',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UniversitySelectModal({ open, onClose }: Props) {
  const { universityId, selectUniversity } = useUniversity();
  const t = useTranslations('universityModal');
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => getUniversitiesByCountry(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, University[]> = {};
    for (const [country, unis] of Object.entries(grouped)) {
      const matches = unis.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.city?.toLowerCase().includes(q) ||
          COUNTRY_NAMES[country]?.toLowerCase().includes(q)
      );
      if (matches.length > 0) result[country] = matches;
    }
    return result;
  }, [search, grouped]);

  const handleSelect = (id: string) => {
    selectUniversity(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          onClick={onClose}
          initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
          animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: '520px', width: '100%', maxHeight: '80vh' }}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="py-5 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold">{t('title')}</h2>
                <p className="text-sm opacity-80 mt-0.5">{t('subtitle')}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-gray-100 shrink-0">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* University list */}
            <div className="overflow-y-auto flex-1 px-4 py-3">
              {Object.keys(filtered).length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  {t('noResults')}
                </p>
              ) : (
                Object.entries(filtered).map(([country, unis]) => (
                  <div key={country} className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                      {COUNTRY_NAMES[country] || country}
                    </h3>
                    <div className="space-y-1">
                      {unis.map((uni) => {
                        const isSelected = universityId === uni.id;
                        return (
                          <button
                            key={uni.id}
                            onClick={() => handleSelect(uni.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                              isSelected
                                ? 'bg-gray-100 ring-2'
                                : 'hover:bg-gray-50'
                            }`}
                            style={
                              isSelected
                                ? { outlineColor: uni.colors.primary }
                                : undefined
                            }
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
                              style={{ backgroundColor: uni.colors.primary }}
                            >
                              {uni.shortName.slice(0, 4)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {uni.shortName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {uni.name}
                                {uni.city && ` · ${uni.city}`}
                              </p>
                            </div>
                            {isSelected && (
                              <FiCheck
                                size={18}
                                style={{ color: uni.colors.primary }}
                                className="shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
