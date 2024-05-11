export const getRandomNumber = (min: number, max: number, truncate = true) => {
	const val = min + Math.random() * (max - min);
	return truncate ? Math.trunc(val) : val;
};

export const numFormatter = new Intl.NumberFormat('en-GB', {
	notation: 'compact',
	maximumSignificantDigits: 3,
});
