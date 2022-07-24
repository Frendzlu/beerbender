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
	sidesInternal: [boolean, boolean, boolean, boolean] // bottom end top start
	color: string

	constructor(color: string) {
		this.sidesInternal = [true, true, true, true]
		this.color = color
		this.room = null
	}

	public get sides() {
		return {
			bottom: this.sidesInternal[0],
			end: this.sidesInternal[1],
			top: this.sidesInternal[2],
			start: this.sidesInternal[3],
		}
	}

	public set sides({bottom, end, top, start}: Sides){
		this.sidesInternal = [bottom, end, top, start]
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

