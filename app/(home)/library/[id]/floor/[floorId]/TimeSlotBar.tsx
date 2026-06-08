'use client';

import { useState, useMemo } from 'react';
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

function formatDuration(startMin: number, endMin: number): string {
  const totalMin = endMin - startMin;
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}

interface TimeSlotBarProps {
  hours: TimeSlot[];
  onSelect?: (startTime: string, endTime: string) => void;
}

export default function TimeSlotBar({ hours, onSelect }: TimeSlotBarProps) {
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);

  const blocks = useMemo(() => buildBlocks(hours), [hours]);

  const allSlots = hours;
  if (!allSlots.length) return null;

  const timelineStart = timeToMinutes(allSlots[0].hour);
  const lastSlot = allSlots[allSlots.length - 1];
  const lastEnd = new Date(`1970-01-01T${lastSlot.hour}:00`);
  lastEnd.setMinutes(lastEnd.getMinutes() + 30);
  const timelineEnd = timeToMinutes(`${lastEnd.getHours().toString().padStart(2, '0')}:${lastEnd.getMinutes().toString().padStart(2, '0')}`);
  const totalRange = timelineEnd - timelineStart;

  const handleClick = (time: string) => {
    if (!selStart || (selStart && selEnd)) {
      setSelStart(time);
      setSelEnd(null);
    } else {
      const startMin = timeToMinutes(selStart);
      const clickedMin = timeToMinutes(time);
      if (clickedMin === startMin) {
        setSelEnd(time);
      } else if (clickedMin < startMin) {
        setSelEnd(selStart);
        setSelStart(time);
      } else {
        setSelEnd(time);
      }
    }
  };

  const selectionComplete = selStart && selEnd;
  if (selectionComplete) {
    const selDuration = 30;
    const endPlus = new Date(`1970-01-01T${selEnd}:00`);
    endPlus.setMinutes(endPlus.getMinutes() + selDuration);
    const endTimeStr = `${endPlus.getHours().toString().padStart(2, '0')}:${endPlus.getMinutes().toString().padStart(2, '0')}`;
    onSelect?.(selStart, endTimeStr);
  }

  const selectedStartMin = selStart ? timeToMinutes(selStart) : null;
  const selectedEndMin = selEnd ? timeToMinutes(selEnd) + 30 : null;

  return (
    <div className="w-full">
      <div className="relative h-5 mb-1">
        <span className="absolute left-0 text-xs text-gray-400">{allSlots[0].hour}</span>
        <span className="absolute right-0 text-xs text-gray-400">{lastEnd.getHours().toString().padStart(2, '0')}:{lastEnd.getMinutes().toString().padStart(2, '0')}</span>
        {selectionComplete && selectedStartMin !== null && selectedEndMin !== null && (
          <>
            <span className="absolute text-xs font-semibold text-blue-700" style={{ left: `${((selectedStartMin - timelineStart) / totalRange) * 100}%`, transform: 'translateX(-50%)' }}>{selStart}</span>
            <span className="absolute text-xs font-semibold text-blue-700" style={{ left: `${((selectedEndMin - timelineStart) / totalRange) * 100}%`, transform: 'translateX(-50%)' }}>{selEnd}</span>
          </>
        )}
      </div>

      <div className="relative w-full h-10 rounded-lg overflow-hidden bg-gray-200 flex">
        {blocks.map((block, i) => {
          const blockStart = timeToMinutes(block.start);
          const blockEnd = timeToMinutes(block.end);
          const leftPct = ((blockStart - timelineStart) / totalRange) * 100;
          const widthPct = ((blockEnd - blockStart) / totalRange) * 100;

          return (
            <div key={i} className="absolute top-0 h-full flex" style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
              {block.slots.map((slot, j) => {
                const slotStart = timeToMinutes(slot.hour);
                const slotEnd = slotStart + 30;
                const slotInSel = selectionComplete && selectedStartMin !== null && selectedEndMin !== null && selectedStartMin < slotEnd && selectedEndMin > slotStart;
                const isSelStart = selStart === slot.hour;
                const isSelEnd = selEnd === slot.hour;

                return (
                  <button
                    key={j}
                    onClick={(e) => { e.stopPropagation(); handleClick(slot.hour); }}
                    className="flex-1 relative transition-all duration-100 border-r border-green-600/20 last:border-r-0 group"
                    style={{ backgroundColor: slotInSel ? (isSelStart || isSelEnd ? '#1d4ed8' : '#3b82f6') : '#22c55e' }}
                    title={`${slot.hour} — ${slot.places_available} seat${slot.places_available !== 1 ? 's' : ''}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {slot.hour} · {slot.places_available} seat{slot.places_available !== 1 ? 's' : ''}
                    </div>
                    {(isSelStart || isSelEnd) && (
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

      {selectionComplete && selectedStartMin !== null && selectedEndMin !== null && (
        <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
          <div>
            <span className="text-sm font-semibold text-blue-900">{selStart} → {selEnd}</span>
            <span className="text-sm text-blue-600 ml-2">({formatDuration(selectedStartMin, selectedEndMin)})</span>
          </div>
          <button onClick={() => { setSelStart(null); setSelEnd(null); }} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Clear</button>
        </div>
      )}

      {!selectionComplete && selStart && <p className="mt-2 text-sm text-gray-500 text-center">Click another slot to select a range</p>}
      {!selStart && <p className="mt-2 text-sm text-gray-500 text-center">Click a slot to start selection</p>}
    </div>
  );
}
