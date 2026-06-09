import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UniversityProvider } from '@/components/UniversityContext';
import { EmailProvider } from '@/components/EmailContext';
import UNavbar from '@/components/UNavbar';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'setEmail': 'Set Email',
      'emailShort': 'Email',
      'changeUniversity': 'Change university',
    };
    return translations[key] || key;
  },
}));

vi.mock('next/font/google', () => ({
  Quicksand: () => ({ className: 'mocked-font' }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@mui/material', () => ({
  AppBar: ({ children, style }: React.PropsWithChildren<{ style?: React.CSSProperties }>) => <div data-testid="appbar" style={style}>{children}</div>,
  Toolbar: ({ children, sx }: React.PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
  Typography: ({ children, variant }: React.PropsWithChildren<{ variant?: string }>) => <div>{children}</div>,
  Box: ({ children, sx }: React.PropsWithChildren<Record<string, unknown>>) => <div>{children}</div>,
}));

function renderNavbar() {
  return render(
    <UniversityProvider>
      <EmailProvider>
        <UNavbar />
      </EmailProvider>
    </UniversityProvider>
  );
}

describe('UNavbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows ULB badge by default', () => {
    renderNavbar();
    expect(screen.getByText('ULB')).toBeInTheDocument();
  });

  it('shows Fast Booker title', () => {
    renderNavbar();
    expect(screen.getByText('Fast Booker')).toBeInTheDocument();
  });

  it('shows Set Email when no email saved', () => {
    renderNavbar();
    expect(screen.getByText('Set Email')).toBeInTheDocument();
  });

  it('shows email when saved', () => {
    localStorage.setItem('userEmail', 'test@ulb.be');
    renderNavbar();
    expect(screen.getByText('test@ulb.be')).toBeInTheDocument();
  });

  it('university badge is a button', () => {
    renderNavbar();
    const uniButton = screen.getByText('ULB').closest('button');
    expect(uniButton).toBeTruthy();
  });

  it('shows saved university from localStorage', () => {
    localStorage.setItem('selectedUniversity', 'unipd');
    renderNavbar();
    expect(screen.getByText('UniPD')).toBeInTheDocument();
  });
});
