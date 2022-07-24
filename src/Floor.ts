import Cell, {CellFactory} from "./Cell";

export interface FloorOptions {
	minimalCellSize: number
	cellNumberMultiplier: number
}

const defaultFloorOptions = {
	initialCellNumber: 6,
	minimalCellSize: 1/8,
	cellNumberMultiplier: 2
}

export class FloorFactory {
	currentFloorId: number = 0
	minCellSize: number
	cellNumberMultiplier: number
	maxFloors: number

	constructor(maxFloors: number, options: Partial<FloorOptions> = defaultFloorOptions) {
		this.minCellSize = options.minimalCellSize || defaultFloorOptions.minimalCellSize
		this.cellNumberMultiplier = options.cellNumberMultiplier || defaultFloorOptions.cellNumberMultiplier
		this.maxFloors = maxFloors
	}

	createFloor(): Floor {
		this.currentFloorId++
		let outwardConnectionsAmount = 1
		if (this.cellNumberMultiplier > 1){
			while (this.currentFloorId / (this.currentCellNumber * this.cellNumberMultiplier) >= this.minCellSize) {
				this.currentCellNumber *= this.cellNumberMultiplier
			}
		}
		if ((this.currentFloorId + 1) / (this.currentCellNumber * this.cellNumberMultiplier) >= this.minCellSize) {
			outwardConnectionsAmount = this.cellNumberMultiplier
		}
		if (this.currentFloorId === this.maxFloors) outwardConnectionsAmount = 0
		return new Floor(this.currentCellNumber, this.currentFloorId, this.cellNumberMultiplier, outwardConnectionsAmount)
	}
}

export default class Floor {
	cells: Cell[] // sorted from 12 o'clock clockwise
	floorNumber: number

	constructor(numberOfCells: number, floorNumber: number, cellNumberMultiplier: number, outwardConnectionsAmount: number) {
		let rf = new CellFactory(floorNumber, numberOfCells)
		this.floorNumber = floorNumber
		this.cells = Array(numberOfCells)
			.fill(undefined)
			.map(() => rf.createCell(cellNumberMultiplier, outwardConnectionsAmount))
	}
}