import {Point} from "./Point";

export class Line {
	A: Point
	B: Point
	coeffA: number
	coeffB: number

	constructor(a: Point, b: Point) {
		this.A = a
		this.B = b
		this.coeffA = (b.y - a.y) / (a.x - b.x)
		this.coeffB = -a.y - a.x * this.coeffA
	}

	evalEquation(x: number) {
		return (x * this.coeffA + this.coeffB) * -1
	}
}