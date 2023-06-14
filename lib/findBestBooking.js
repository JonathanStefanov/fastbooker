export default function findBestBookingPlan(hours) {
  hours = hours.filter((hour) => hour.places_available > 0);
  const blocks = [];
  let startHourIndex = 0;
  let endHourIndex = 0;
  const minBookingSlots = 1; // 30 minutes = 1 slot
  const maxBookingSlots = 8; // 4 hours = 8 slots (4*60/30)

  while (startHourIndex < hours.length) {
      const startHour = hours[startHourIndex].hour;
      let slots = 0;

      // Find the maximum bookable slots from the startHourIndex
      while (endHourIndex < hours.length && slots < maxBookingSlots) {
          const endHour = hours[endHourIndex].hour;

          const currentHourDate = new Date(`1970-01-01T${endHour}:00`);
          const previousHourDate = new Date(`1970-01-01T${startHour}:00`);

          // calculate the difference in slots
          slots = (currentHourDate.getTime() - previousHourDate.getTime()) / (1000 * 60 * 30);

          if (slots < maxBookingSlots) {
              endHourIndex++;
          }
      }

      // If we have the minimum required slots, add to the blocks
      if (slots >= minBookingSlots) {
          // Adjust the end time to include the next 30-minute slot
          const endHour = hours[endHourIndex - 1].hour;
          const endTime = new Date(`1970-01-01T${endHour}:00`);
          endTime.setMinutes(endTime.getMinutes() + 30);
          const endHourAdjusted = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

          blocks.push([hours[startHourIndex].hour, endHourAdjusted]);
      }

      startHourIndex = endHourIndex;
  }

  console.log(blocks);

  return blocks;
}
