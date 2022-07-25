export default class Utils {
	static randomArrayElement <T> (array: Array<T>): T | undefined {
		if (array.length > 0) {
			return array[Math.random() * array.length]
		} else return undefined
	}

	/*static pickRandomMazeCell(floors: Floor[]): Cell {
		return this.randomArrayElement(this.randomArrayElement(floors)?.rooms!)!
	}*/
}