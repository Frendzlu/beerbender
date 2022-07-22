import Floor from "./Floor";
import Room from "./Room";

export default class Utils {
	static randomArrayElement<T extends any>(array: Array<T>): T | undefined {
		if (array.length > 0) {
			return array[Math.random()*array.length]
		} else return undefined
	}

	static pickRandomMazeCell(floors: Floor[]): Room {
		return this.randomArrayElement(this.randomArrayElement(floors)?.rooms!)!
	}
}