import Cell from "./Cell";
import {WorldOptions} from "./World";
import {CELL_SIDES, PI2} from "./consts";
import {PolarPoint} from "./Geometry";

export interface RoomId {
  floorNumber: number
  roomNumber: number
}

export interface RoomConnection {
  roomId: RoomId
  isOpen: boolean
}

interface RoomParams {
  startFloor: number
  endFloor: number
  startPos: number
  endPos: number
  startFloorCells: number
}

interface FloorParams {
  startPos: number,
  endPos: number,
  cells: number
}

export class RoomFactory {
  floorAmount: number
  worldOptions: WorldOptions
  cells: Cell[][]

  constructor(floorAmount: number, worldOptions: WorldOptions, cells: Cell[][]) {
    this.floorAmount = floorAmount
    this.worldOptions = worldOptions
    this.cells = cells
  }

  private generateRandomRoomParams(): RoomParams {
    // for sqrt look at https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
    const startFloor = Math.floor(this.floorAmount * Math.sqrt(Math.random())) + 1
    const startFloorCells = this.cells[startFloor].length
    const startPos = Math.floor(startFloorCells * Math.random())
    return {
      startFloor: startFloor,
      endFloor: Math.min(startFloor + Math.floor(Math.random() * 2 + 1.5), this.floorAmount + 1),
      startFloorCells: startFloorCells,
      startPos: startPos,
      endPos: Math.min(Math.floor(startPos + 1 + 5 * Math.random()), startPos + startFloorCells)
    }
  }

  private isRoomColliding(roomParams: RoomParams): boolean {
    for (let i = roomParams.startFloor; i < roomParams.endFloor; i++) {
      let floorStartPos = roomParams.startPos
      let floorEndPos = roomParams.endPos
      const cellsFloor = this.cells[i].length
      if (cellsFloor != roomParams.startFloorCells) {
        const multi = cellsFloor / roomParams.startFloorCells
        floorStartPos *= multi
        floorEndPos *= multi
      }

      for (let j = floorStartPos; j < floorEndPos; j++) {
        if (this.cells[i][j % cellsFloor].room != null) {
          return true
        }
      }
    }
    return false
  }

  private getRecalculatedParamsForFloor(roomParams: RoomParams, floor: number): FloorParams {
    let floorStartPos = roomParams.startPos
    let floorEndPos = roomParams.endPos
    const floorCells = this.cells[floor].length
    if (floorCells != roomParams.startFloorCells) {
      const multi = floorCells / roomParams.startFloorCells
      floorStartPos *= multi
      floorEndPos *= multi
    }
    return {
      startPos: floorStartPos,
      endPos: floorEndPos,
      cells: floorCells
    }
  }

  createRoom(): Room {
    let roomParams = this.generateRandomRoomParams()

    while (this.isRoomColliding(roomParams)) {
      roomParams = this.generateRandomRoomParams()
    }

    const room = new Room(roomParams.startFloor, roomParams.endFloor, roomParams.startPos, roomParams.endPos, roomParams.startFloorCells)

    for (let i = roomParams.startFloor; i < roomParams.endFloor; i++) {
      const floorParams = this.getRecalculatedParamsForFloor(roomParams, i)

      for (let j = floorParams.startPos; j < floorParams.endPos; j++) {
        const cell = this.cells[i][j % floorParams.cells]
        cell.room = room
        if (i == roomParams.startFloor && j == floorParams.startPos) {
          if (i != (roomParams.endFloor - 1)) {
            cell.internalSides[CELL_SIDES.TOP] = false
          }
          if (j != (floorParams.endPos - 1)) {
            cell.internalSides[CELL_SIDES.END] = false
          }
        }
        else if (i == roomParams.startFloor && j != (floorParams.endPos - 1)) {
          cell.internalSides[CELL_SIDES.START] = false
          cell.internalSides[CELL_SIDES.END] = false
          if (i != (roomParams.endFloor - 1)) {
            cell.internalSides[CELL_SIDES.TOP] = false
          }
        }
        else if (i == roomParams.startFloor && j == (floorParams.endPos - 1)) {
          if (i != (roomParams.endFloor - 1)) {
            cell.internalSides[CELL_SIDES.TOP] = false
          }
          if (j != floorParams.endPos) {
            cell.internalSides[CELL_SIDES.START] = false
          }
        }
        else if (i != (roomParams.endFloor - 1) && j == floorParams.startPos) {
          cell.internalSides[CELL_SIDES.TOP] = false
          cell.internalSides[CELL_SIDES.BOTTOM] = false
          if (j != (floorParams.endPos - 1)) {
            cell.internalSides[CELL_SIDES.END] = false
          }
        }
        else if (i != (roomParams.endFloor - 1) && j != (floorParams.endPos - 1)) {
          cell.internalSides = [false, false, false, false]
        }
        else if (i != (roomParams.endFloor - 1) && j == (floorParams.endPos - 1)) {
          cell.internalSides[CELL_SIDES.TOP] = false
          cell.internalSides[CELL_SIDES.BOTTOM] = false
          if (j != roomParams.startPos) {
            cell.internalSides[CELL_SIDES.START] = false
          }
        }
        else if (j == floorParams.startPos) {
          if (i != roomParams.startFloor) {
            cell.internalSides[CELL_SIDES.BOTTOM] = false
          }
          if (j != (floorParams.endPos - 1)) {
            cell.internalSides[CELL_SIDES.END] = false
          }
        }
        else if (j != (floorParams.endPos - 1)) {
          cell.internalSides[CELL_SIDES.START] = false
          cell.internalSides[CELL_SIDES.END] = false
          if (i != roomParams.startFloor) {
            cell.internalSides[CELL_SIDES.BOTTOM] = false
          }
        }
        else {
          if (i != roomParams.startFloor) {
            cell.internalSides[CELL_SIDES.BOTTOM] = false
          }
          if (j != floorParams.startPos) {
            cell.internalSides[CELL_SIDES.START] = false
          }

        }

      }
    }
    return room
  }
}

export default class Room {
  startFloor: number
  endFloor: number
  startPos: number
  endPos: number
  center: PolarPoint

  constructor(startFloor: number, endFloor: number, startPos: number, endPos: number, startFloorCells: number) {
    this.startFloor = startFloor
    this.endFloor = endFloor
    this.startPos = startPos
    this.endPos = endPos
    this.center = new PolarPoint({r: (startFloor + endFloor) / 2, angle: (startPos + endPos) * PI2 / (2 * startFloorCells)})
  }
}