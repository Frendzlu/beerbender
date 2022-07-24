import Cell from "./Cell";
import {FloorOptions} from "./World";
import {CELL_SIDES} from "./consts";

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
  cells: Cell[][]

  constructor(floorAmount: number, worldOptions: FloorOptions, cells: Cell[][]) {
    this.floorAmount = floorAmount
    this.worldOptions = worldOptions
    this.cells = cells
  }


  createRoom(): Room {
    this.currentRoomNumber++
    let room = undefined
    roomLoop:
    while (room == undefined){
      let startFloor = Math.floor(this.floorAmount * Math.random()) + 1
      let endFloor = Math.min(startFloor + Math.floor(Math.random() + 1.5), this.floorAmount + 1)
      let startFloorCells = this.cells[startFloor].length
      let startPos = Math.floor(startFloorCells * Math.random())
      let endPos = Math.floor(startPos + 1 + 5*Math.random())
      for (let i = startFloor; i < endFloor; i++){
        let floorStartPos = startPos
        let floorEndPos = endPos
        let cellsFloor = this.cells[i].length
        let m = undefined
        if(cellsFloor != startFloorCells){
          let multi = cellsFloor/startFloorCells
          m = multi
          floorStartPos*=multi
          floorEndPos*=multi
        }
        console.log("floor:", startFloor, endFloor, "Pos:", startPos, endPos, "floor Pos:", floorStartPos, floorEndPos, "multi", m)

        for(let j = floorStartPos; j < floorEndPos; j++){
          if(this.cells[i][j%cellsFloor].room != null){
            console.log("Fail")
            continue roomLoop;
          }
        }
      }
      console.log("Success")

      room = new Room(this.currentRoomNumber, startFloor, endFloor, startPos, endPos)

      for (let i = startFloor; i < endFloor; i++){
        let floorStartPos = startPos
        let floorEndPos = endPos
        let cellsFloor = this.cells[i].length
        if(cellsFloor != startFloorCells){
          let multi = cellsFloor/startFloorCells
          floorStartPos*=multi
          floorEndPos*=multi
        }
        //console.log(startPos, floorStartPos , "end", endPos, floorEndPos, "mult:")

        for(let j = floorStartPos; j < floorEndPos; j++){
          let cell = this.cells[i][j%cellsFloor]
          cell.room = room
          if(i == startFloor && j == floorStartPos){
            if(i != (endFloor-1)){
              cell.sidesInternal[CELL_SIDES.TOP] = false
            }
            if(j != (floorEndPos-1)){
              cell.sidesInternal[CELL_SIDES.END] = false
            }
          }
          else if(i == startFloor && j != (floorEndPos-1)){
            cell.sidesInternal[CELL_SIDES.START] = false
            cell.sidesInternal[CELL_SIDES.END] = false
            if(i != (endFloor-1)){
              cell.sidesInternal[CELL_SIDES.TOP] = false
            }
          }
          else if(i == startFloor && j == (floorEndPos-1)){
            if(i != (endFloor-1)){
              cell.sidesInternal[CELL_SIDES.TOP] = false
            }
            if(j != floorStartPos){
              cell.sidesInternal[CELL_SIDES.START] = false
            }
          }
          else if(i != (endFloor-1) && j == floorStartPos){
            cell.sidesInternal[CELL_SIDES.TOP] = false
            cell.sidesInternal[CELL_SIDES.BOTTOM] = false
            if(j != (floorEndPos-1)){
              cell.sidesInternal[CELL_SIDES.END] = false
            }
          }
          else if(i != (endFloor-1) && j != (floorEndPos-1)){
            cell.sidesInternal = [false, false, false, false]
          }
          else if(i != (endFloor-1) && j == (floorEndPos-1)){
            cell.sidesInternal[CELL_SIDES.TOP] = false
            cell.sidesInternal[CELL_SIDES.BOTTOM] = false
            if(j != startPos){
              cell.sidesInternal[CELL_SIDES.START] = false
            }
          }
          else if(j == floorStartPos){
            if(i != startFloor){
              cell.sidesInternal[CELL_SIDES.BOTTOM] = false
            }
            if(j != (floorEndPos-1)){
              cell.sidesInternal[CELL_SIDES.END] = false
            }
          }
          else if(j != (floorEndPos -1)){
            cell.sidesInternal[CELL_SIDES.START] = false
            cell.sidesInternal[CELL_SIDES.END] = false
            if(i != startFloor){
              cell.sidesInternal[CELL_SIDES.BOTTOM] = false
            }
          }
          else {
            if(i != startFloor){
              cell.sidesInternal[CELL_SIDES.BOTTOM] = false
            }
            if(j != floorStartPos){
              cell.sidesInternal[CELL_SIDES.START] = false
            }

          }

        }
      }



    }
    return room
  }
}

export default class Room {
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
  }
}