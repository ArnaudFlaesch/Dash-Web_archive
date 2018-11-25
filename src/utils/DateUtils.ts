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
	return(parsedDate.getHours() +":" + parsedDate.getMinutes());
}