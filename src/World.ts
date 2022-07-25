import Room, {RoomFactory} from "./Room";
import Cell, {CellFactory} from "./Cell";
import {IPolarPoint} from "./Geometry";

export interface WorldGenerationData {
	floorAmount: number
	roomAmount: number
	worldOptions: WorldOptions
	//physicalProperties?: Partial<IPhysicalProperties>
}

export interface WorldOptions {
	minimalCellSize: number
	cellNumberMultiplier: number
}

export class World {
	rooms: Room[]
	cells: Cell[][]
	floorAmount: number
	roomAmount: number
	centers: IPolarPoint[]
	worldOptions: WorldOptions

	constructor(options: WorldGenerationData) {
		this.floorAmount = options.floorAmount
		this.roomAmount = options.roomAmount
		this.worldOptions = options.worldOptions
		let cf = new CellFactory()
		this.cells = Array(options.floorAmount +  1).fill(undefined).map((_, i) => {
			let maxFloorCellsFromSize = ((i*2*Math.PI)/this.worldOptions.minimalCellSize)
			let pow = Math.floor(Math.log2(maxFloorCellsFromSize) / Math.log2(this.worldOptions.cellNumberMultiplier))
			let maxFloorCellsFromSizeAndMultiplier = this.worldOptions.cellNumberMultiplier**pow
			return Array(maxFloorCellsFromSizeAndMultiplier).fill(undefined).map(() => cf.createCell())
		})
		let rf = new RoomFactory(options.floorAmount, options.worldOptions, this.cells)
		this.rooms = Array(options.roomAmount).fill(undefined).map(() => rf.createRoom())
		this.centers = this.rooms.map(r => r.center)
	}
}