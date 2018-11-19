export function formatDateFromUTC(date) {
	let parsedDate = new Date(date);
	return (parsedDate.toLocaleString("fr"));
}