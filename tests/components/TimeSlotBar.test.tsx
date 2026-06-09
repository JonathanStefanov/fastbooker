import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotBar from '@/app/[locale]/(home)/library/[id]/floor/[floorId]/TimeSlotBar';
import type { TimeSlot } from '@/types';

function makeSlots(hours: string[], available = true): TimeSlot[] {
  return hours.map(h => ({
    hour: h,
    places_available: available ? 5 : 0,
    status: available ? 'available' as const : 'unavailable' as const,
  }));
}

describe('TimeSlotBar', () => {
  it('renders nothing for empty hours', () => {
    const { container } = render(<TimeSlotBar hours={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders slot buttons for available hours', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('shows time labels below slots', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('09:30')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows default instruction when nothing selected', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30'])} />);
    expect(screen.getByText('Tap or swipe to select time slots')).toBeInTheDocument();
  });

  it('toggles slot selection on click', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    const buttons = screen.getAllByRole('button');

    // Click first slot
    fireEvent.click(buttons[0]);
    // Should show selection summary instead of default text
    expect(screen.queryByText('Tap or swipe to select time slots')).not.toBeInTheDocument();
  });

  it('deselects slot on second click', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    const buttons = screen.getAllByRole('button');

    // Click to select
    fireEvent.click(buttons[0]);
    // Click again to deselect
    fireEvent.click(buttons[0]);
    // Should show default instruction again
    expect(screen.getByText('Tap or swipe to select time slots')).toBeInTheDocument();
  });

  it('allows selecting multiple non-contiguous slots', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00', '10:30'])} />);
    const buttons = screen.getAllByRole('button');

    // Click first and last slot (non-contiguous)
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[3]);

    // Should show two separate ranges
    const summaries = screen.getAllByText(/→/);
    expect(summaries.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelect with selected slot hours', () => {
    const onSelect = vi.fn();
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} onSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);

    // onSelect should be called with the selected slot
    expect(onSelect).toHaveBeenCalledWith(expect.arrayContaining(['09:00']));
  });

  it('calls onSelect with empty array when all deselected', () => {
    const onSelect = vi.fn();
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30'])} onSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');

    // Select then deselect
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);

    const lastCall = onSelect.mock.calls[onSelect.mock.calls.length - 1];
    expect(lastCall[0]).toEqual([]);
  });

  it('shows clear button when slots are selected', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30'])} />);
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('clears all selections when clear is clicked', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    const buttons = screen.getAllByRole('button');

    // Select two slots
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    // Click clear
    fireEvent.click(screen.getByText('Clear'));

    // Should show default instruction
    expect(screen.getByText('Tap or swipe to select time slots')).toBeInTheDocument();
  });

  it('shows slot count in hover tooltip', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00'])} />);
    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveAttribute('title', '09:00 — 5 seats');
  });

  it('shows singular "seat" for 1 available', () => {
    const slots: TimeSlot[] = [{ hour: '09:00', places_available: 1, status: 'available' }];
    render(<TimeSlotBar hours={slots} />);
    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveAttribute('title', '09:00 — 1 seat');
  });

  it('shows duration in selection summary', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00', '09:30', '10:00'])} />);
    const buttons = screen.getAllByRole('button');

    // Select first two slots (09:00-10:00 = 1h)
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(screen.getByText('(1h)')).toBeInTheDocument();
  });

  it('renders green background for available slots', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00'])} />);
    const button = screen.getAllByRole('button')[0];
    expect(button.style.backgroundColor).toBe('rgb(34, 197, 94)'); // #22c55e
  });

  it('renders blue background for selected slots', () => {
    render(<TimeSlotBar hours={makeSlots(['09:00'])} />);
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(button.style.backgroundColor).toBe('rgb(29, 78, 216)'); // #1d4ed8
  });
});
