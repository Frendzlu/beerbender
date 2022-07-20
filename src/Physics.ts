import {Geometry} from "./Geometry";

export namespace Physics {

	export interface IPhysicalProperties {
		mass: number
		dimensions: Dimensions
		density: number
		frictionCoefficient: number
		isMovable: boolean
		forceDampeningCoefficient: number
		dampensForce: boolean
	}

	export type Dimensions = {
		width: number
		height: number
	}

	export type Vector = {
		anchorPoint: Geometry.IPoint
		value: number
		angle: number // angle from -180 to 180, zero being 12 o'clock
	}
}

