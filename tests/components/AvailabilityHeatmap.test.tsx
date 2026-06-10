import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AvailabilityHeatmap from '@/components/AvailabilityHeatmap';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'title': "This Week's Availability",
      'subtitle': 'See which days have the most free seats at a glance',
      'legend.plenty': 'Plenty',
      'legend.moderate': 'Moderate',
      'legend.few': 'Few seats',
      'legend.full': 'Full',
      'legend.noData': 'No data',
    };
    return map[key] ?? key;
  },
}));

const mockHeatmapData = [
  {
    date: '2026-06-10',
    dayName: 'Wed',
    slots: [
      { hour: '08:00', available: 10, total: 20 },
      { hour: '09:00', available: 5, total: 20 },
      { hour: '10:00', available: 0, total: 20 },
    ],
  },
  {
    date: '2026-06-11',
    dayName: 'Thu',
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

  it('shows loading state initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });
    expect(document.querySelector('.MuiCircularProgress-root')).toBeTruthy();
  });

  it('renders heatmap with data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("This Week's Availability")).toBeTruthy();
    });

    // Day labels should be present
    expect(screen.getByText('Wed')).toBeTruthy();
    expect(screen.getByText('Thu')).toBeTruthy();

    // Legend items
    expect(screen.getByText('Plenty')).toBeTruthy();
    expect(screen.getByText('Full')).toBeTruthy();
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

  it('shows tooltip on hover', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeatmapData,
    } as Response);

    render(<AvailabilityHeatmap libraryId="test-lib" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("This Week's Availability")).toBeTruthy();
    });

    // Find a heatmap cell (the colored boxes)
    const cells = document.querySelectorAll('[title]');
    const targetCell = Array.from(cells).find(el => el.getAttribute('title')?.includes('08:00'));
    if (targetCell) {
      fireEvent.mouseEnter(targetCell);
      await waitFor(() => {
        expect(screen.getByText(/seats available/)).toBeTruthy();
      });
    }
  });
});
