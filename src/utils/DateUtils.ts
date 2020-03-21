export function formatDateFromTimestamp(date : number, offset = 0) {
	const parsedDate = new Date(date * 1000 + offset * 1000);
	return (parsedDate.toLocaleString("fr"));
}

export function formatDateFromUTC(date : string) {
	const parsedDate = new Date(date);
	return (parsedDate.toLocaleString("fr"));
}

export function formatDayFromUTC(date : string) {
	const parsedDate = new Date(date);
	return (parsedDate.getDate() + "/" + parsedDate.getMonth() + "/" + parsedDate.getFullYear());
}

export function formatTimeFromDate(date : string) {
	const parsedDate = new Date(date);
	return(parsedDate.getHours() + ":" + parsedDate.getMinutes());
}

export function adjustTimeWithOffset(offset: number) {
	const localeOffset = -(new Date().getTimezoneOffset() * 60);
	if (Math.abs(offset) === Math.abs(localeOffset)) return 0;
	const offsetMilliseconds = Math.abs(offset) + Math.abs(localeOffset);
	return (offset < localeOffset) ? -offsetMilliseconds : offsetMilliseconds;
}