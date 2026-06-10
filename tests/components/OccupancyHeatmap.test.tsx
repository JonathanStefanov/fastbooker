import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OccupancyHeatmap from '@/components/OccupancyHeatmap';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockOccupancyData = {
  currentOccupancy: 65,
  currentOpened: true,
  siteName: 'ULB - BSS',
  forecasts: [
    { hour: '16:30', occupancy: 60, opened: true },
    { hour: '17:00', occupancy: 60, opened: true },
    { hour: '17:30', occupancy: 55, opened: true },
    { hour: '18:00', occupancy: 50, opened: true },
    { hour: '18:30', occupancy: 40, opened: true },
    { hour: '19:00', occupancy: 30, opened: true },
  ],
  buildings: [
    { id: 'b1', name: 'Bâtiment GE', occupancy: 65, opened: true },
    { id: 'b2', name: 'Bâtiment D', occupancy: 70, opened: true },
  ],
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={en}>
        {ui}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}

describe('OccupancyHeatmap', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOccupancyData),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders site name', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('ULB - BSS')).toBeInTheDocument();
    });
  });

  it('renders forecast bars with hours', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('16:30')).toBeInTheDocument();
      expect(screen.getByText('17:00')).toBeInTheDocument();
      expect(screen.getByText('18:00')).toBeInTheDocument();
    });
  });

  it('renders occupancy percentages', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('55%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
    });
  });

  it('renders building breakdown', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Bâtiment GE')).toBeInTheDocument();
      expect(screen.getByText('Bâtiment D')).toBeInTheDocument();
    });
  });

  it('renders legend', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText(/quiet/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
      expect(screen.getByText(/busy/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentOccupancy: null,
        currentOpened: false,
        forecasts: [],
        buildings: [],
        siteName: 'Test',
      }),
    });

    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText(/no occupancy data/i)).toBeInTheDocument();
    });
  });

  it('renders building closed chip', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        ...mockOccupancyData,
        buildings: [
          { id: 'b1', name: 'Bâtiment GE', occupancy: null, opened: false },
        ],
      }),
    });

    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Bâtiment GE')).toBeInTheDocument();
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });

  it('shows tooltip on bar hover', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('16:30')).toBeInTheDocument();
    });

    const bar = screen.getByTestId('occupancy-bar-16:30');
    fireEvent.mouseEnter(bar);

    await waitFor(() => {
      expect(screen.getByText(/60% occupancy/i)).toBeInTheDocument();
    });
  });

  it('renders today forecast section header', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText(/today's forecast/i)).toBeInTheDocument();
    });
  });

  it('renders buildings section header', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText(/buildings/i)).toBeInTheDocument();
    });
  });

  it('fetches from correct API endpoint', async () => {
    renderWithProviders(<OccupancyHeatmap libraryId="lib-42" />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/occupancy?library=lib-42');
    });
  });
});
