import Cell from "./Cell";
import {FloorOptions} from "./World";
import {CELL_SIDES} from "./consts";
import {IPolarPoint} from "./Geometry";

export interface RoomId {
  floorNumber: number
  roomNumber: number
}

export interface RoomConnection {
  roomId: RoomId
  isOpen: boolean
}

export class RoomFactory {
  floorAmount: number
  worldOptions: FloorOptions
  cells: Cell[][]

  constructor(floorAmount: number, worldOptions: FloorOptions, cells: Cell[][]) {
    this.floorAmount = floorAmount
    this.worldOptions = worldOptions
    this.cells = cells
  }


  createRoom(): Room {
    let room = undefined
    roomLoop:
    while (room == undefined){
      let startFloor = Math.floor(this.floorAmount * Math.sqrt(Math.random())) + 1 // for sqrt look https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
      let endFloor = Math.min(startFloor + Math.floor(Math.random()*2 + 1.5), this.floorAmount + 1)
      let startFloorCells = this.cells[startFloor].length
      let startPos = Math.floor(startFloorCells * Math.random())
      let endPos = Math.floor(startPos + 1 + 5*Math.random())
      endPos = Math.min(endPos, startPos + startFloorCells)
      for (let i = startFloor; i < endFloor; i++){
        let floorStartPos = startPos
        let floorEndPos = endPos
        let cellsFloor = this.cells[i].length
        if(cellsFloor != startFloorCells){
          let multi = cellsFloor/startFloorCells
          floorStartPos*=multi
          floorEndPos*=multi
        }

        for(let j = floorStartPos; j < floorEndPos; j++){
          if(this.cells[i][j%cellsFloor].room != null){
            continue roomLoop;
          }
        }
      }

      room = new Room(startFloor, endFloor, startPos, endPos, startFloorCells)

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
  startFloor: number
  endFloor: number
  startPos: number
  endPos: number
  center: IPolarPoint

  constructor(startFloor: number, endFloor: number, startPos: number, endPos: number, cellsOnFloor: number) {
    this.startFloor = startFloor
    this.endFloor = endFloor
    this.startPos = startPos
    this.endPos = endPos
    this.center = {r: (startFloor+endFloor)/2, angle: (startPos+endPos)/(2*cellsOnFloor)}
  }
}