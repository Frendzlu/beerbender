export interface RoomId {
	floorNumber: number
	roomNumber: number
}

export interface RoomConnection {
	roomId: RoomId
	isOpen: boolean
}

export class CellFactory {
	currentCellNumber = 0
	floorNumber: number
	roomAmount: number

	constructor(floorNumber: number, roomAmount: number) {
		this.floorNumber = floorNumber
		this.roomAmount = roomAmount
	}


	createRoom(multiplier: number, numberOfOutwardConnections: number) {
		this.currentCellNumber++
		let room = new Room(this.floorNumber, this.currentCellNumber)
		room.addConnection(this.floorNumber, this.currentCellNumber < this.roomAmount ? this.currentCellNumber+1 : 1, Math.random() > 0.5)
		room.addConnection(this.floorNumber, this.currentCellNumber > 1 ? this.currentCellNumber-1 : this.roomAmount, Math.random() > 0.5)
		if (this.floorNumber > 1) {
			room.addConnection(this.floorNumber - 1, Math.ceil(this.currentCellNumber / multiplier), Math.random() > 0.5)
		}
		if (numberOfOutwardConnections > 0) {
			for (let i = 1; i <= numberOfOutwardConnections; i++) {
				room.addConnection(this.floorNumber + 1, (this.currentCellNumber - 1) * numberOfOutwardConnections + i, Math.random() > 0.5)
			}
		}
		return room
	}
}

export default class Cell {
	connections: RoomConnection[]
	id: RoomId

	constructor(floorId: number, roomId: number) {
		this.id = {
			floorNumber: floorId,
			roomNumber: roomId
		}
		this.connections = []
	}

	addConnection(floorNumber: number, roomNumber: number, open: boolean = false) {
		this.connections.push({
			roomId: {
				floorNumber: floorNumber,
				roomNumber: roomNumber
			},
			isOpen: open
		})
	}

	removeConnection(roomId: RoomId) {
		let roomConnection = this.connections.find(conn => conn.roomId.roomNumber === roomId.roomNumber && conn.roomId.floorNumber === roomId.floorNumber)
		if (roomConnection) {
			this.connections.splice(this.connections.indexOf(roomConnection), 1)
		}
	}
}