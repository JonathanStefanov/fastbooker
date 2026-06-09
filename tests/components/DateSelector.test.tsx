import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DateSelector from '@/app/[locale]/(home)/library/[id]/floor/[floorId]/DateSelector';

let mockLocale = 'en';

vi.mock('next-intl', () => ({
  useLocale: () => mockLocale,
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: mockLocale }),
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { whileHover, whileTap, animate, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

vi.mock('@/components/UniversityContext', () => ({
  useUniversity: () => ({
    university: {
      colors: { primary: '#991b1b', hoverDate: '#7f1d1d' },
    },
  }),
}));

describe('DateSelector', () => {
  it('renders 7 day buttons', () => {
    render(<DateSelector onDateChange={() => {}} />);
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBe(7);
  });

  it('shows English day names when locale is en', () => {
    mockLocale = 'en';
    render(<DateSelector onDateChange={() => {}} />);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const found = dayNames.filter(name => screen.queryAllByText(name).length > 0);
    expect(found.length).toBeGreaterThan(0);
  });

  it('shows Italian day names when locale is it', () => {
    mockLocale = 'it';
    render(<DateSelector onDateChange={() => {}} />);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const found = dayNames.filter(name => screen.queryAllByText(name).length > 0);
    expect(found.length).toBeGreaterThan(0);
  });

  it('shows French day names when locale is fr', () => {
    mockLocale = 'fr';
    render(<DateSelector onDateChange={() => {}} />);
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const found = dayNames.filter(name => screen.queryAllByText(name).length > 0);
    expect(found.length).toBeGreaterThan(0);
  });

  it('calls onDateChange when clicking a day', () => {
    mockLocale = 'en';
    const onChange = vi.fn();
    render(<DateSelector onDateChange={onChange} />);
    const buttons = document.querySelectorAll('button');
    buttons[0].click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  });

  it('falls back to English for unknown locale', () => {
    mockLocale = 'xx';
    render(<DateSelector onDateChange={() => {}} />);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const found = dayNames.filter(name => screen.queryAllByText(name).length > 0);
    expect(found.length).toBeGreaterThan(0);
  });
});
