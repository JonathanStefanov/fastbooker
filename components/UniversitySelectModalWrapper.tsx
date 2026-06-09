'use client';

import { useUniversity } from './UniversityContext';
import UniversitySelectModal from './UniversitySelectModal';

export default function UniversitySelectModalWrapper() {
  const { showUniModal, closeUniModal } = useUniversity();
  return <UniversitySelectModal open={showUniModal} onClose={closeUniModal} />;
}
