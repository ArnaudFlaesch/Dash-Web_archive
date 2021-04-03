import addDays from 'date-fns/addDays'

export function getDayFromNow(numberOfDays: number): Date {
  return addDays(new Date(), numberOfDays);
}

export function formatDateFromTimestamp(timestamp: number, offset = 0): Date {
  return new Date(timestamp * 1000 + offset * 1000);
}

export function formatDateFromUTC(date: string): string {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleString('fr');
}

export function formatDayFromUTC(date: string): string {
  const parsedDate = new Date(date);
  return (
    parsedDate.getDate() +
    '/' +
    parsedDate.getMonth() +
    '/' +
    parsedDate.getFullYear()
  );
}

export function formatTimeFromDate(date: string): string {
  const parsedDate = new Date(date);
  return parsedDate.getHours() + ':' + parsedDate.getMinutes();
}

export function adjustTimeWithOffset(offset: number): number {
  const localeOffset = -(new Date().getTimezoneOffset() * 60);
  if (Math.abs(offset) === Math.abs(localeOffset)) {
    return 0;
  }
  const offsetMilliseconds = Math.abs(offset) + Math.abs(localeOffset);
  return offset < localeOffset ? -offsetMilliseconds : offsetMilliseconds;
}
