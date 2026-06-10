import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AvailabilityHeatmap from '@/components/AvailabilityHeatmap';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'noData': 'No availability data',
      'seatsAvailable': 'seats available',
      'clickToView': 'Click to see seats for this day',
      'legend.plenty': 'Plenty',
      'legend.moderate': 'Moderate',
      'legend.few': 'Few seats',
      'legend.full': 'Full',
      'legend.noData': 'No data',
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

const mockHeatmapData = [
  {
    date: '2026-06-10',
    dayName: 'Wed',
    dayNumber: 10,
    isToday: true,
    slots: [
      { hour: '08:00', available: 10, total: 20 },
      { hour: '09:00', available: 5, total: 20 },
      { hour: '10:00', available: 0, total: 20 },
    ],
  },
  {
    date: '2026-06-11',
    dayName: 'Thu',
    dayNumber: 11,
    isToday: false,
    slots: [
      { hour: '08:00', available: 15, total: 20 },
      { hour: '09:00', available: 8, total: 20 },
      { hour: '10:00', available: 2, total: 20 },
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

describe('AvailabilityHeatmap', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });
    expect(document.querySelector('.MuiCircularProgress-root')).toBeTruthy();
  });

  it('renders heatmap grid with day labels', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Wed')).toBeTruthy();
    });

    expect(screen.getByText('Thu')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('11')).toBeTruthy();
  });

  it('renders time slot labels', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeTruthy();
    });
  });

  it('renders legend', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/Plenty/)).toBeTruthy();
    });
    expect(screen.getByText(/Moderate/)).toBeTruthy();
    expect(screen.getByText(/Few seats/)).toBeTruthy();
    expect(screen.getByText(/Full/)).toBeTruthy();
  });

  it('navigates to all-seats page on cell click', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Wed')).toBeTruthy();
    });

    const cell = screen.getByTestId('heatmap-cell-2026-06-11-08:00');
    fireEvent.click(cell);
    expect(mockPush).toHaveBeenCalledWith('/library/test-lib/all-seats?date=2026-06-11');
  });

  it('shows no data message when empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { date: '2026-06-10', dayName: 'Wed', dayNumber: 10, isToday: true, slots: [] },
      ],
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No availability data')).toBeTruthy();
    });
  });

  it('renders nothing on error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'fail' }),
    } as Response);

    const { container } = render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(container.innerHTML).toBe('');
    });
  });
});
