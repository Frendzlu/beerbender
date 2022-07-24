import {FloorOptions} from "./Floor";

export interface RoomId {
  floorNumber: number
  roomNumber: number
}

export interface RoomConnection {
  roomId: RoomId
  isOpen: boolean
}

export class RoomFactory {
  currentRoomNumber = 0
  floorAmount: number
  worldOptions: FloorOptions

  //floorNumber: number
  //roomAmount: number

  constructor(floorAmount: number, worldOptions: FloorOptions) {
    this.floorAmount = floorAmount
    this.worldOptions = worldOptions
    //this.roomAmount = roomAmount
  }


  createRoom(/*multiplier: number, numberOfOutwardConnections: number*/): Room {
    this.currentRoomNumber++
    let startFloor = Math.floor(this.floorAmount * Math.random()) + 1
    let endFloor = Math.min(startFloor + 1 + Math.floor(Math.random() + 0.5), this.floorAmount)
    let maxCellsOnFloorExact = ((startFloor*2*Math.PI)/this.worldOptions.minimalCellSize)
    let pow = Math.floor(Math.log2(maxCellsOnFloorExact) / Math.log2(this.worldOptions.cellNumberMultiplier))
    let maxCellsOnFlorCapped = this.worldOptions.cellNumberMultiplier**pow
    let startPos = Math.floor(maxCellsOnFlorCapped * Math.random())
    let endPos = Math.floor(startPos + 1 + 5*Math.random())
    let room = new Room(this.currentRoomNumber, startFloor, endFloor, startPos, endPos)



    /*room.addConnection(this.floorNumber, this.currentRoomNumber < this.roomAmount ? this.currentRoomNumber+1 : 1)
    room.addConnection(this.floorNumber, this.currentRoomNumber > 1 ? this.currentRoomNumber-1 : this.roomAmount)
    if (this.floorNumber > 1) {
      room.addConnection(this.floorNumber - 1, Math.ceil(this.currentRoomNumber / multiplier))
    }
    if (numberOfOutwardConnections > 0) {
      for (let i = 1; i <= numberOfOutwardConnections; i++) {
        room.addConnection(this.floorNumber + 1, (this.currentRoomNumber - 1) * numberOfOutwardConnections + i)
      }
    }*/
    return room
  }
}

export default class Room {
  //connections: RoomConnection[]
  id: number
  startFloor: number
  endFloor: number
  startPos: number
  endPos: number

  constructor(id: number, startFloor: number, endFloor: number, startPos: number, endPos: number) {
    this.id = id;
    this.startFloor = startFloor
    this.endFloor = endFloor
    this.startPos = startPos
    this.endPos = endPos

    /*
    this.id = {
      floorNumber: floorId,
      roomNumber: roomId
    }
    this.connections = []*/
  }
  /*
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
    }*/
}