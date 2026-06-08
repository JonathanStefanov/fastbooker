'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EmailContext = createContext(null);

export function EmailProvider({ children }) {
  const [email, setEmailState] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userEmail');
    if (saved) setEmailState(saved);
  }, []);

  const setEmail = useCallback((newEmail) => {
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

  // Returns true if email is set, false if modal was opened
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

export function useEmail() {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error('useEmail must be used within EmailProvider');
  return ctx;
}
