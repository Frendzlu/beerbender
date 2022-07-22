import Floor, {FloorFactory, FloorOptions} from "./Floor";
import {IPhysicalProperties} from "./Physics";

export interface WorldGenerationData {
	floorAmount: number
	floorOptions?: Partial<FloorOptions>
	physicalProperties?: Partial<IPhysicalProperties>
}

export class World {
	floorAmount: number
	floors: Floor[]

	constructor(options: WorldGenerationData) {
		this.floorAmount = options.floorAmount
		let ff = new FloorFactory(options.floorAmount, options.floorOptions)
		this.floors = Array(options.floorAmount).fill(undefined).map(() => ff.createFloor())
	}

	generateConnectionsFromSeed(seed: number) {
		console.log(seed)
	}
}