import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UniversityProvider } from '@/components/UniversityContext';
import UniversitySelectModal from '@/components/UniversitySelectModal';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Select Your University',
      'subtitle': 'Choose your institution to get started',
      'searchPlaceholder': 'Search universities...',
      'noResults': 'No universities found',
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

function renderModal(open = true, onClose = () => {}) {
  return render(
    <UniversityProvider>
      <UniversitySelectModal open={open} onClose={onClose} />
    </UniversityProvider>
  );
}

describe('UniversitySelectModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders when open', () => {
    renderModal(true);
    expect(screen.getByText('Select Your University')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderModal(false);
    expect(screen.queryByText('Select Your University')).not.toBeInTheDocument();
  });

  it('shows search input', () => {
    renderModal(true);
    expect(screen.getByPlaceholderText('Search universities...')).toBeInTheDocument();
  });

  it('lists universities grouped by country', () => {
    renderModal(true);
    expect(screen.getByText('Belgium')).toBeInTheDocument();
    expect(screen.getByText('Switzerland')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('shows ULB university', () => {
    renderModal(true);
    // ULB appears as short name and possibly in the card
    const ulbElements = screen.getAllByText('ULB');
    expect(ulbElements.length).toBeGreaterThan(0);
  });

  it('shows UniPD university', () => {
    renderModal(true);
    const unipdElements = screen.getAllByText('UniPD');
    expect(unipdElements.length).toBeGreaterThan(0);
  });

  it('shows EPFL university', () => {
    renderModal(true);
    const epflElements = screen.getAllByText('EPFL');
    expect(epflElements.length).toBeGreaterThan(0);
  });

  it('filters universities by search', () => {
    renderModal(true);
    const input = screen.getByPlaceholderText('Search universities...');
    fireEvent.change(input, { target: { value: 'Padova' } });
    const unipdElements = screen.getAllByText('UniPD');
    expect(unipdElements.length).toBeGreaterThan(0);
    expect(screen.queryByText('Belgium')).not.toBeInTheDocument();
  });

  it('filters by city name', () => {
    renderModal(true);
    const input = screen.getByPlaceholderText('Search universities...');
    fireEvent.change(input, { target: { value: 'Lausanne' } });
    // UNIL and EPFL are both in Lausanne
    const unilElements = screen.getAllByText('UNIL');
    expect(unilElements.length).toBeGreaterThan(0);
  });

  it('shows no results message for invalid search', () => {
    renderModal(true);
    const input = screen.getByPlaceholderText('Search universities...');
    fireEvent.change(input, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No universities found')).toBeInTheDocument();
  });

  it('selects university and closes on click', () => {
    localStorage.setItem('selectedUniversity', 'ulb');
    let closed = false;
    renderModal(true, () => { closed = true; });
    const unipdButtons = screen.getAllByText('UniPD');
    const button = unipdButtons[0].closest('button');
    expect(button).toBeTruthy();
    if (button) fireEvent.click(button);
    expect(localStorage.getItem('selectedUniversity')).toBe('unipd');
    expect(closed).toBe(true);
  });
});
