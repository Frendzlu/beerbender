import {FloorOptions} from "./Floor";
import Room, {RoomFactory} from "./Room";

export interface WorldGenerationData {
	floorAmount: number
	roomAmount: number
	worldOptions: FloorOptions
	//physicalProperties?: Partial<IPhysicalProperties>
}

export class World {
	rooms: Room[]
	floorAmount: number
	roomAmount: number
	worldOptions: FloorOptions

	constructor(options: WorldGenerationData) {
		this.floorAmount = options.floorAmount
		this.roomAmount = options.roomAmount
		this.worldOptions = options.worldOptions
		let rf = new RoomFactory(options.floorAmount, options.worldOptions)
		this.rooms = Array(options.roomAmount).fill(undefined).map(() => rf.createRoom())
		//let ff = new FloorFactory(options.floorAmount, options.floorOptions)
		//this.floors = Array(options.floorAmount).fill(undefined).map(() => ff.createFloor())
	}
}