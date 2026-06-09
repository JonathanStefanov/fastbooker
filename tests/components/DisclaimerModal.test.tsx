import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DisclaimerModal from '@/components/DisclaimerModal';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'modalTitle': 'Important Notice',
      'notAffiliated': 'Not affiliated with Affluences',
      'beforeUsing': 'Before using',
      'unofficialTool': 'Unofficial tool',
      'accountBanned': 'Account may be banned',
      'stopWorking': 'May stop working',
      'ownRisk': 'Use at own risk',
      'noWarranty': 'No warranty',
      'educationalOnly': 'Educational only',
      'educationalPurpose': 'Educational purpose',
      'useOfficial': 'Use Official App',
      'iUnderstand': 'I Understand',
      'readFull': 'Read full disclaimer',
    };
    return translations[key] || key;
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('DisclaimerModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows modal on first visit', () => {
    render(<DisclaimerModal />);
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
  });

  it('does not show modal if already accepted', () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    render(<DisclaimerModal />);
    expect(screen.queryByText('Important Notice')).not.toBeInTheDocument();
  });

  it('accepts disclaimer and saves to localStorage', () => {
    render(<DisclaimerModal />);
    const acceptButton = screen.getByText('I Understand');
    fireEvent.click(acceptButton);
    expect(localStorage.getItem('disclaimer-accepted')).toBe('true');
  });

  it('fires disclaimerAccepted event on accept', () => {
    const eventSpy = vi.fn();
    window.addEventListener('disclaimerAccepted', eventSpy);
    render(<DisclaimerModal />);
    fireEvent.click(screen.getByText('I Understand'));
    expect(eventSpy).toHaveBeenCalled();
    window.removeEventListener('disclaimerAccepted', eventSpy);
  });

  it('shows decline button', () => {
    render(<DisclaimerModal />);
    expect(screen.getByText('Use Official App')).toBeInTheDocument();
  });
});
