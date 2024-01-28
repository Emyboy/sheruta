export const hasEmptyValue = (obj: any): boolean => {
	for (const key in obj) {
		if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
			return true
		}
	}
	return false
}

export function getRandomNumber(min: number, max: number): number {
	if (min > max) {
		throw new Error('Minimum value must be less than or equal to maximum value')
	}
	const randomDecimal = Math.random()
	const randomNumber = Math.floor(randomDecimal * (max - min + 1) + min)
	return randomNumber
}

export function formatPrice(digit: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
	})
	return formatter.format(digit)
}
