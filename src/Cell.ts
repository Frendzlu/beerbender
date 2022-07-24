export interface CellId {
	floorNumber: number
	cellNumber: number
}

export interface CellConnection {
	cellId: CellId
	isOpen: boolean
}

export class CellFactory {
	currentCellNumber = 0
	floorNumber: number
	cellAmount: number

	constructor(floorNumber: number, cellAmount: number) {
		this.floorNumber = floorNumber
		this.cellAmount = cellAmount
	}


	createCell(multiplier: number, numberOfOutwardConnections: number) {
		this.currentCellNumber++
		let cell = new Cell(this.floorNumber, this.currentCellNumber)
		cell.addConnection(this.floorNumber, this.currentCellNumber < this.cellAmount ? this.currentCellNumber+1 : 1, Math.random() > 0.5)
		cell.addConnection(this.floorNumber, this.currentCellNumber > 1 ? this.currentCellNumber-1 : this.cellAmount, Math.random() > 0.5)
		if (this.floorNumber > 1) {
			cell.addConnection(this.floorNumber - 1, Math.ceil(this.currentCellNumber / multiplier), Math.random() > 0.5)
		}
		if (numberOfOutwardConnections > 0) {
			for (let i = 1; i <= numberOfOutwardConnections; i++) {
				cell.addConnection(this.floorNumber + 1, (this.currentCellNumber - 1) * numberOfOutwardConnections + i, Math.random() > 0.5)
			}
		}
		return cell
	}
}

export default class Cell {
	connections: CellConnection[]
	id: CellId

	constructor(floorId: number, cellId: number) {
		this.id = {
			floorNumber: floorId,
			cellNumber: cellId
		}
		this.connections = []
	}

	addConnection(floorNumber: number, cellNumber: number, open: boolean = false) {
		this.connections.push({
			cellId: {
				floorNumber: floorNumber,
				cellNumber: cellNumber
			},
			isOpen: open
		})
	}

	removeConnection(cellId: CellId) {
		let cellConnection = this.connections.find(conn => conn.cellId.cellNumber === cellId.cellNumber && conn.cellId.floorNumber === cellId.floorNumber)
		if (cellConnection) {
			this.connections.splice(this.connections.indexOf(cellConnection), 1)
		}
	}
}