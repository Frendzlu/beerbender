class Room {
	connections: Room[]
	id: number

	constructor(roomId: number) {
		this.id = roomId
		this.connections = []
	}

	addConnection(room: Room) {
		this.connections.push(room)
	}

	removeConnection(room: Room) {
		this.connections.splice(this.connections.indexOf(room), 1)
	}

}

class RoomFactory {
	currentRoomId = 0

	createRoom() {
		this.currentRoomId++
		return new Room(this.currentRoomId)
	}
}

class Floor {
	rooms: Room[]
	floorId: number

	constructor(numberOfRooms: number, floorId: number) {
		let rf = new RoomFactory()
		this.floorId = floorId
		this.rooms = Array(numberOfRooms).fill(undefined).map(() => rf.createRoom())
	}
}

interface FloorOptions {
	initialRoomNumber: number
	minimalRoomSize: number
	roomNumberMultiplier: number
}

const defaultFloorOptions = {
	initialRoomNumber: 6,
	minimalRoomSize: 1/8,
	roomNumberMultiplier: 2
}

class FloorFactory {
	currentFloorId: number = 0
	currentRoomNumber: number
	minRoomSize: number
	roomNumberMultiplier: number

	constructor(options: Partial<FloorOptions> = defaultFloorOptions) {
		this.minRoomSize = options.minimalRoomSize || defaultFloorOptions.minimalRoomSize
		this.currentRoomNumber = options.initialRoomNumber || defaultFloorOptions.initialRoomNumber
		this.roomNumberMultiplier = options.roomNumberMultiplier || defaultFloorOptions.roomNumberMultiplier
	}

	createFloor() {
		this.currentFloorId++
		//console.log(this.currentFloorId / this.currentRoomNumber*2)
		if (this.currentFloorId / (this.currentRoomNumber * 2) >= this.minRoomSize) {
			this.currentRoomNumber *= this.roomNumberMultiplier
		}
		return new Floor(this.currentRoomNumber, this.currentFloorId)
	}
}

export class Maze {
	floorNumber: number
	floors: Floor[]

	constructor(floorNumber: number, options?: Partial<FloorOptions>) {
		this.floorNumber = floorNumber
		let ff = new FloorFactory(options)
		this.floors = Array(floorNumber).fill(undefined).map(() => ff.createFloor())
	}
}