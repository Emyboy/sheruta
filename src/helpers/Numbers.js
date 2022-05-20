export default class NumbersHelper {
	static getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
}
