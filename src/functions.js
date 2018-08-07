/**
 * Format number with comma seperators
 * @param {string} x
 */
export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * UK date format string
 * @param {string} dateString
 */
export function printDate(dateString) {
	var date = new Date(dateString);
	return (date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear());
}