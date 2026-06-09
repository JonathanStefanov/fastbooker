'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { TimeSlot } from '@/types';

interface Block {
  start: string;
  end: string;
  endPrev: string;
  slots: TimeSlot[];
}

function buildBlocks(hours: TimeSlot[]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const slot of hours) {
    const available = slot.places_available > 0;
    if (available) {
      const slotDuration = 30;
      if (current && current.endPrev === slot.hour) {
        const endTime = new Date(`1970-01-01T${slot.hour}:00`);
        endTime.setMinutes(endTime.getMinutes() + slotDuration);
        current.end = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        current.endPrev = slot.hour;
        current.slots.push(slot);
      } else {
        const endTime = new Date(`1970-01-01T${slot.hour}:00`);
        endTime.setMinutes(endTime.getMinutes() + slotDuration);
        current = {
          start: slot.hour,
          end: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
          endPrev: slot.hour,
          slots: [slot],
        };
        blocks.push(current);
      }
    } else {
      current = null;
    }
  }
  return blocks;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function formatDuration(startMin: number, endMin: number): string {
  const totalMin = endMin - startMin;
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}

function getContiguousRanges(slots: string[]): { start: string; end: string }[] {
  if (slots.length === 0) return [];
  const sorted = [...slots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  const ranges: { start: string; end: string }[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = timeToMinutes(rangeEnd) + 30;
    if (timeToMinutes(sorted[i]) === prevEnd) {
      rangeEnd = sorted[i];
    } else {
      ranges.push({ start: rangeStart, end: rangeEnd });
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }
  ranges.push({ start: rangeStart, end: rangeEnd });
  return ranges;
}

interface TimeSlotBarProps {
  hours: TimeSlot[];
  onSelect?: (slots: string[]) => void;
}

export default function TimeSlotBar({ hours, onSelect }: TimeSlotBarProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStartIndex = useRef<number | null>(null);
  const swipeHasToggled = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const blocks = useMemo(() => buildBlocks(hours), [hours]);
  const availableSlots = useMemo(() => hours.filter(s => s.places_available > 0), [hours]);

  const timelineStart = hours.length > 0 ? timeToMinutes(hours[0].hour) : 0;
  const timelineEnd = useMemo(() => {
    if (hours.length === 0) return 0;
    const lastSlot = hours[hours.length - 1];
    const lastEnd = new Date(`1970-01-01T${lastSlot.hour}:00`);
    lastEnd.setMinutes(lastEnd.getMinutes() + 30);
    return timeToMinutes(`${lastEnd.getHours().toString().padStart(2, '0')}:${lastEnd.getMinutes().toString().padStart(2, '0')}`);
  }, [hours]);
  const totalRange = timelineEnd - timelineStart;

  const toggleSlot = useCallback((hour: string) => {
    setSelectedSlots(prev => {
      const next = new Set(prev);
      if (next.has(hour)) {
        next.delete(hour);
      } else {
        next.add(hour);
      }
      return next;
    });
  }, []);

  const findSlotAtX = useCallback((clientX: number): number | null => {
    if (!containerRef.current || availableSlots.length === 0) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = x / rect.width;
    const minutes = timelineStart + pct * totalRange;
    let closest: number | null = null;
    let minDist = Infinity;
    for (let i = 0; i < availableSlots.length; i++) {
      const dist = Math.abs(timeToMinutes(availableSlots[i].hour) - minutes);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    return closest;
  }, [availableSlots, timelineStart, totalRange]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const clientX = e.touches[0].clientX;
    const idx = findSlotAtX(clientX);
    if (idx !== null) {
      setIsSwiping(false);
      swipeStartIndex.current = idx;
      swipeHasToggled.current = false;
    }
  }, [findSlotAtX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (swipeStartIndex.current === null) return;
    const clientX = e.touches[0].clientX;
    const idx = findSlotAtX(clientX);
    if (idx === null) return;

    if (!isSwiping) {
      setIsSwiping(true);
      swipeHasToggled.current = true;
    }

    setSelectedSlots(prev => {
      const next = new Set(prev);
      const minI = Math.min(swipeStartIndex.current!, idx);
      const maxI = Math.max(swipeStartIndex.current!, idx);
      for (let i = minI; i <= maxI; i++) {
        next.add(availableSlots[i].hour);
      }
      return next;
    });
  }, [findSlotAtX, isSwiping, availableSlots]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeHasToggled.current && swipeStartIndex.current !== null) {
      toggleSlot(availableSlots[swipeStartIndex.current].hour);
    }
    setIsSwiping(false);
    swipeStartIndex.current = null;
    swipeHasToggled.current = false;
  }, [availableSlots, toggleSlot]);

  useEffect(() => {
    onSelect?.(Array.from(selectedSlots));
  }, [selectedSlots, onSelect]);

  if (!hours.length) return null;

  const ranges = getContiguousRanges(Array.from(selectedSlots));

  return (
    <div className="w-full">
      <div
        className="relative w-full h-10 rounded-lg overflow-hidden bg-gray-200 flex"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {blocks.map((block, i) => {
          const blockStart = timeToMinutes(block.start);
          const blockEnd = timeToMinutes(block.end);
          const leftPct = ((blockStart - timelineStart) / totalRange) * 100;
          const widthPct = ((blockEnd - blockStart) / totalRange) * 100;

          return (
            <div key={i} className="absolute top-0 h-full flex" style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
              {block.slots.map((slot, j) => {
                const isSelected = selectedSlots.has(slot.hour);

                return (
                  <button
                    key={j}
                    onClick={(e) => { e.stopPropagation(); toggleSlot(slot.hour); }}
                    className="flex-1 relative transition-all duration-100 border-r border-green-600/20 last:border-r-0 group select-none touch-none"
                    style={{ backgroundColor: isSelected ? '#1d4ed8' : '#22c55e' }}
                    title={`${slot.hour} — ${slot.places_available} seat${slot.places_available !== 1 ? 's' : ''}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {slot.hour} · {slot.places_available} seat{slot.places_available !== 1 ? 's' : ''}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="relative w-full h-5 mt-1">
        {availableSlots.map((slot) => {
          const slotStart = timeToMinutes(slot.hour);
          const leftPct = ((slotStart - timelineStart) / totalRange) * 100;
          return (
            <span
              key={slot.hour}
              className="absolute text-[10px] text-gray-400 -translate-x-1/2"
              style={{ left: `${leftPct}%` }}
            >
              {slot.hour}
            </span>
          );
        })}
      </div>

      {selectedSlots.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {ranges.map((range, i) => {
              const startMin = timeToMinutes(range.start);
              const endMin = timeToMinutes(range.end) + 30;
              return (
                <span key={i} className="text-sm font-semibold text-blue-900">
                  {range.start} → {formatTime(endMin)}
                  <span className="text-blue-600 font-normal ml-1">({formatDuration(startMin, endMin)})</span>
                  {i < ranges.length - 1 && <span className="text-blue-400 mx-1">+</span>}
                </span>
              );
            })}
          </div>
          <button
            onClick={() => { setSelectedSlots(new Set()); }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {selectedSlots.size === 0 && (
        <p className="mt-2 text-sm text-gray-500 text-center">Tap or swipe to select time slots</p>
      )}
    </div>
  );
}
