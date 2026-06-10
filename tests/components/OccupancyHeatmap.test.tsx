import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OccupancyHeatmap from '@/components/OccupancyHeatmap';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/messages/en.json';

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

const server = setupServer(
  http.get('/api/occupancy', () => {
    return HttpResponse.json(mockOccupancyData);
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

describe('OccupancyHeatmap', () => {
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

    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText(/no occupancy data/i)).toBeInTheDocument();
    });
  });

  it('renders building closed chip', async () => {
    server.use(
      http.get('/api/occupancy', () => {
        return HttpResponse.json({
          ...mockOccupancyData,
          buildings: [
            { id: 'b1', name: 'Bâtiment GE', occupancy: null, opened: false },
          ],
        });
      })
    );

    renderWithProviders(<OccupancyHeatmap libraryId="lib-1" />);
    await waitFor(() => {
      expect(screen.getByText('Bâtiment GE')).toBeInTheDocument();
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });
  });
});
