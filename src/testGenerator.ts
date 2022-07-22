interface RoomId {
	floorNumber: number
	roomNumber: number
}

interface RoomConnection {
	roomId: RoomId
	isOpen: boolean
}

class Room {
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

class RoomFactory {
	currentRoomNumber = 0
	floorNumber: number
	roomAmount: number

	constructor(floorNumber: number, roomAmount: number) {
		this.floorNumber = floorNumber
		this.roomAmount = roomAmount
	}


	createRoom(multiplier: number, numberOfOutwardConnections: number) {
		this.currentRoomNumber++
		let room = new Room(this.floorNumber, this.currentRoomNumber)
		room.addConnection(this.floorNumber, this.currentRoomNumber < this.roomAmount ? this.currentRoomNumber+1 : 1)
		room.addConnection(this.floorNumber, this.currentRoomNumber > 1 ? this.currentRoomNumber-1 : this.roomAmount)
		if (this.floorNumber > 1) {
			room.addConnection(this.floorNumber - 1, Math.ceil(this.roomAmount / multiplier))
		}
		if (numberOfOutwardConnections > 0) {
			for (let i = 0; i < numberOfOutwardConnections; i++) {
				room.addConnection(this.floorNumber + 1, this.currentRoomNumber + i)
			}
		}
		return room
	}
}

class Floor {
	rooms: Room[]
	floorNumber: number

	constructor(numberOfRooms: number, floorNumber: number, roomNumberMultiplier: number, outwardConnectionsAmount: number) {
		let rf = new RoomFactory(floorNumber, numberOfRooms)
		this.floorNumber = floorNumber
		this.rooms = Array(numberOfRooms)
			.fill(undefined)
			.map(() => rf.createRoom(roomNumberMultiplier, outwardConnectionsAmount))
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
	maxFloors: number

	constructor(maxFloors: number, options: Partial<FloorOptions> = defaultFloorOptions) {
		this.minRoomSize = options.minimalRoomSize || defaultFloorOptions.minimalRoomSize
		this.currentRoomNumber = options.initialRoomNumber || defaultFloorOptions.initialRoomNumber
		this.roomNumberMultiplier = options.roomNumberMultiplier || defaultFloorOptions.roomNumberMultiplier
		this.maxFloors = maxFloors
	}

	createFloor() {
		this.currentFloorId++
		let outwardConnectionsAmount = 1
		while (this.currentFloorId / (this.currentRoomNumber * this.roomNumberMultiplier) >= this.minRoomSize) {
			this.currentRoomNumber *= this.roomNumberMultiplier
		}
		if ((this.currentFloorId + 1) / (this.currentRoomNumber * this.roomNumberMultiplier) >= this.minRoomSize) {
			outwardConnectionsAmount = this.roomNumberMultiplier
		}
		if (this.currentFloorId === this.maxFloors) outwardConnectionsAmount = 0
		return new Floor(this.currentRoomNumber, this.currentFloorId, this.roomNumberMultiplier, outwardConnectionsAmount)
	}
}

export class Maze {
	floorAmount: number
	floors: Floor[]

	constructor(floorAmount: number, options?: Partial<FloorOptions>) {
		this.floorAmount = floorAmount
		let ff = new FloorFactory(floorAmount, options)
		this.floors = Array(floorAmount).fill(undefined).map(() => ff.createFloor())
	}
}