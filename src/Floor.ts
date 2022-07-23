import Cell, {CellFactory} from "./Cell";

export interface FloorOptions {
	initialRoomNumber: number
	minimalRoomSize: number
	roomNumberMultiplier: number
}

const defaultFloorOptions = {
	initialRoomNumber: 6,
	minimalRoomSize: 1/8,
	roomNumberMultiplier: 2
}

export class FloorFactory {
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

export default class Floor {
	rooms: Cell[] // sorted from 12 o'clock clockwise
	floorNumber: number

	constructor(numberOfRooms: number, floorNumber: number, roomNumberMultiplier: number, outwardConnectionsAmount: number) {
		let rf = new CellFactory(floorNumber, numberOfRooms)
		this.floorNumber = floorNumber
		this.rooms = Array(numberOfRooms)
			.fill(undefined)
			.map(() => rf.createRoom(roomNumberMultiplier, outwardConnectionsAmount))
	}
}