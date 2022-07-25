export class CellFactory {
	createCell(){
		return new Cell("#000000")
	}
}

import Room from "./Room";

export type Sides = {
	bottom: boolean,
	end: boolean,
	top: boolean,
	start: boolean,
}

export default class Cell {
	room: Room | null
	internalSides: [boolean, boolean, boolean, boolean] // bottom end top start
	color: string

	constructor(color: string) {
		this.internalSides = [true, true, true, true]
		this.color = color
		this.room = null
	}

	public get sides() {
		return {
			bottom: this.internalSides[0],
			end: this.internalSides[1],
			top: this.internalSides[2],
			start: this.internalSides[3],
		}
	}

	public set sides({bottom, end, top, start}: Sides){
		this.internalSides = [bottom, end, top, start]
	}

	/*
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
	}*/
}

