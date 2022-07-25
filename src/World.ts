import Room, {RoomFactory} from "./Room";
import Cell, {CellFactory} from "./Cell";
import Delaunator from "delaunator";
import {PolarPoint} from "./Geometry/PolarPoint";

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
	centers: PolarPoint[]
	worldOptions: WorldOptions
	triangulation?: Uint32Array

	constructor(options: WorldGenerationData) {
		this.floorAmount = options.floorAmount
		this.roomAmount = options.roomAmount
		this.worldOptions = options.worldOptions
		const cf = new CellFactory()
		this.cells = Array(options.floorAmount +  1).fill(undefined).map((_, i) => {
			const maxFloorCellsFromSize = ((i * 2 * Math.PI) / this.worldOptions.minimalCellSize)
			const pow = Math.floor(Math.log2(maxFloorCellsFromSize) / Math.log2(this.worldOptions.cellNumberMultiplier))
			const maxFloorCellsFromSizeAndMultiplier = this.worldOptions.cellNumberMultiplier ** pow
			return Array(maxFloorCellsFromSizeAndMultiplier).fill(undefined).map(() => cf.createCell())
		})
		const rf = new RoomFactory(options.floorAmount, options.worldOptions, this.cells)
		this.rooms = Array(options.roomAmount).fill(undefined).map(() => rf.createRoom())
		this.centers = this.rooms.map(r => r.center)
	}

	triangulate() {
		const delaunay = new Delaunator(this.centers.map((p) => p.toCartesian().toTuple()).flat())
		this.triangulation = delaunay.triangles
	}
}