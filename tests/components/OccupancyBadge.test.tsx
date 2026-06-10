import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OccupancyBadge from '@/components/OccupancyBadge';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

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

describe('OccupancyBadge', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentOccupancy: 75,
        currentOpened: true,
        forecasts: [],
        buildings: [],
        siteName: 'ULB - BSH',
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders occupancy percentage', async () => {
    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('shows busy label for high occupancy', async () => {
    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Busy')).toBeInTheDocument();
    });
  });

  it('shows quiet label for low occupancy', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentOccupancy: 15,
        currentOpened: true,
        forecasts: [],
        buildings: [],
        siteName: 'Test',
      }),
    });

    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Quiet')).toBeInTheDocument();
    });
  });

  it('shows moderate label for medium occupancy', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentOccupancy: 60,
        currentOpened: true,
        forecasts: [],
        buildings: [],
        siteName: 'Test',
      }),
    });

    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Moderate')).toBeInTheDocument();
    });
  });

  it('shows closed chip when not opened', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentOccupancy: 50,
        currentOpened: false,
        forecasts: [],
        buildings: [],
        siteName: 'Test',
      }),
    });

    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });

  it('renders nothing when occupancy is null', async () => {
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

    const { container } = renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(container.querySelector('.MuiCircularProgress-root')).toBeNull();
      expect(container.textContent).toBe('');
    });
  });

  it('renders nothing on error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const { container } = renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(container.textContent).toBe('');
    });
  });

  it('fetches occupancy for correct library', async () => {
    renderWithProviders(<OccupancyBadge libraryId="my-lib-123" />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/occupancy?library=my-lib-123');
    });
  });
});
