import type { TimeSlot } from '@/types';

export default function findBestBookingPlan(hours: TimeSlot[]): [string, string][] {
  const available = hours.filter(hour => hour.places_available > 0);
  const blocks: [string, string][] = [];
  let startHourIndex = 0;
  let endHourIndex = 0;
  const minBookingSlots = 1;
  const maxBookingSlots = 8;

  while (startHourIndex < available.length) {
    const startHour = available[startHourIndex].hour;
    let slots = 0;

    while (endHourIndex < available.length && slots < maxBookingSlots) {
      const endHour = available[endHourIndex].hour;
      const currentHourDate = new Date(`1970-01-01T${endHour}:00`);
      const previousHourDate = new Date(`1970-01-01T${startHour}:00`);
      slots = (currentHourDate.getTime() - previousHourDate.getTime()) / (1000 * 60 * 30);

      if (slots < maxBookingSlots) {
        endHourIndex++;
      }
    }

    if (slots >= minBookingSlots) {
      const endHour = available[endHourIndex - 1].hour;
      const endTime = new Date(`1970-01-01T${endHour}:00`);
      endTime.setMinutes(endTime.getMinutes() + 30);
      const endHourAdjusted = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
      blocks.push([available[startHourIndex].hour, endHourAdjusted]);
    }

    startHourIndex = endHourIndex;
  }

  return blocks;
}
