import Floor from "./Floor";


export interface WorldGenerationData {
	floorAmount: number

	physicalProperties: Partial<IPhysicalProperties>
}

export default class World {
	floors: Floor[] // sorted from core to surface

	constructor(options: WorldGenerationData) {
	}
}