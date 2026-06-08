'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface EmailContextType {
  email: string;
  setEmail: (email: string) => void;
  showModal: boolean;
  openEmailModal: () => void;
  closeEmailModal: () => void;
  requireEmail: () => boolean;
}

const EmailContext = createContext<EmailContextType | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userEmail');
    if (saved) setEmailState(saved);
  }, []);

  const setEmail = useCallback((newEmail: string) => {
    setEmailState(newEmail);
    if (newEmail) {
      localStorage.setItem('userEmail', newEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
    window.dispatchEvent(new CustomEvent('emailChanged', { detail: newEmail }));
  }, []);

  const openEmailModal = useCallback(() => setShowModal(true), []);
  const closeEmailModal = useCallback(() => setShowModal(false), []);

  const requireEmail = useCallback(() => {
    if (email) return true;
    setShowModal(true);
    return false;
  }, [email]);

  return (
    <EmailContext.Provider value={{ email, setEmail, showModal, openEmailModal, closeEmailModal, requireEmail }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail(): EmailContextType {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error('useEmail must be used within EmailProvider');
  return ctx;
}
