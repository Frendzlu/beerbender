import Room, {RoomFactory} from "./Room";
import Cell, {CellFactory} from "./Cell";
import {IPolarPoint} from "./Geometry";

export interface WorldGenerationData {
	floorAmount: number
	roomAmount: number
	worldOptions: FloorOptions
	//physicalProperties?: Partial<IPhysicalProperties>
}

export interface FloorOptions {
	minimalCellSize: number
	cellNumberMultiplier: number
}

export class World {
	rooms: Room[]
	cells: Cell[][]
	floorAmount: number
	roomAmount: number
	centers: IPolarPoint[]
	worldOptions: FloorOptions

	constructor(options: WorldGenerationData) {
		this.floorAmount = options.floorAmount
		this.roomAmount = options.roomAmount
		this.worldOptions = options.worldOptions
		let cf = new CellFactory()
		this.cells = Array(options.floorAmount +  1).fill(undefined).map((_, i) => {
			let maxCellsOnFloorExact = ((i*2*Math.PI)/this.worldOptions.minimalCellSize)
			let pow = Math.floor(Math.log2(maxCellsOnFloorExact) / Math.log2(this.worldOptions.cellNumberMultiplier))
			let maxCellsOnFlorCapped = this.worldOptions.cellNumberMultiplier**pow
			return Array(maxCellsOnFlorCapped).fill(undefined).map(() => cf.createCell())
		})
		let rf = new RoomFactory(options.floorAmount, options.worldOptions, this.cells)
		this.rooms = Array(options.roomAmount).fill(undefined).map(() => rf.createRoom())
		this.centers = this.rooms.map(r => r.center)
	}
}