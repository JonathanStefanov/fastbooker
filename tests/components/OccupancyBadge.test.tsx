import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OccupancyBadge from '@/components/OccupancyBadge';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

const server = setupServer(
  http.get('/api/occupancy', () => {
    return HttpResponse.json({
      currentOccupancy: 75,
      currentOpened: true,
      forecasts: [],
      buildings: [],
      siteName: 'ULB - BSH',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
    server.use(
      http.get('/api/occupancy', () => {
        return HttpResponse.json({
          currentOccupancy: 15,
          currentOpened: true,
          forecasts: [],
          buildings: [],
          siteName: 'Test',
        });
      })
    );

    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Quiet')).toBeInTheDocument();
    });
  });

  it('shows closed chip when not opened', async () => {
    server.use(
      http.get('/api/occupancy', () => {
        return HttpResponse.json({
          currentOccupancy: 50,
          currentOpened: false,
          forecasts: [],
          buildings: [],
          siteName: 'Test',
        });
      })
    );

    renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });

  it('renders nothing when occupancy is null', async () => {
    server.use(
      http.get('/api/occupancy', () => {
        return HttpResponse.json({
          currentOccupancy: null,
          currentOpened: false,
          forecasts: [],
          buildings: [],
          siteName: 'Test',
        });
      })
    );

    const { container } = renderWithProviders(<OccupancyBadge libraryId="lib-1" />);
    await waitFor(() => {
      expect(container.innerHTML).toBe('');
    });
  });
});
