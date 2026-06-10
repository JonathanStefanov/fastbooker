import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AllSeats from '@/app/[locale]/(home)/library/[id]/all-seats/page.tsx';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'title': 'All Available Seats',
      'subtitle': 'Viewing seats across all rooms.',
      'noResults': 'No seats found matching your criteria.',
    };
    return map[key] ?? key;
  },
}));

vi.mock('@/components/UniversityContext', () => ({
  useUniversity: () => ({
    university: {
      colors: { primary: '#3b82f6', hoverDate: '#2563eb' },
    },
  }),
}));

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}));

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockSeats = [
  {
    id: 'seat-1',
    resource_name: 'E 1 01',
    resource_id: 101,
    description: 'Posto con presa elettrica',
    floor_name: 'Piano 1',
    floor_id: 'floor-1',
    hours: [
      { hour: '08:00', places_available: 1, places_total: 1 },
      { hour: '09:00', places_available: 0, places_total: 1 },
    ],
  },
  {
    id: 'seat-2',
    resource_name: 'E 1 02',
    resource_id: 102,
    description: 'Posto vicino alla finestra',
    floor_name: 'Piano 1',
    floor_id: 'floor-1',
    hours: [
      { hour: '08:00', places_available: 0, places_total: 1 },
      { hour: '09:00', places_available: 1, places_total: 1 },
    ],
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('AllSeats page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner while fetching', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<AllSeats params={{ id: 'test-lib' }} />, { wrapper: createWrapper() });
    expect(document.querySelector('.MuiCircularProgress-root')).toBeTruthy();
  });

  it('renders seat list when data is loaded', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockSeats,
    } as Response);

    render(<AllSeats params={{ id: 'test-lib' }} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('E 1 01')).toBeTruthy();
    });
    expect(screen.getByText('E 1 02')).toBeTruthy();
  });

  it('shows no results message when API returns empty array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<AllSeats params={{ id: 'test-lib' }} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No seats found matching your criteria.')).toBeTruthy();
    });
  });

  it('does not show no results when seats exist', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockSeats,
    } as Response);

    render(<AllSeats params={{ id: 'test-lib' }} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('E 1 01')).toBeTruthy();
    });

    expect(screen.queryByText('No seats found matching your criteria.')).toBeNull();
  });
});
