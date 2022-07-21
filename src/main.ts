import {Maze} from "./testGenerator";
import {Geometry} from "./Geometry";
import Point = Geometry.Point;

let x = new Maze(17, {
	minimalRoomSize: 1/6,
	roomNumberMultiplier: 3,
	initialRoomNumber: 5
})
console.log(x)

let canvas = document.getElementById("testCanvas") as HTMLCanvasElement

render(x, canvas)


function render(maze: Maze, canvas: HTMLCanvasElement) {
	let ctx = canvas.getContext("2d")!
	let minDim = (canvas.width < canvas.height ? canvas.width : canvas.height)
	let floorHeight = ((minDim * 0.90) / 2) / maze.floorNumber
	let center = new Point(canvas.width / 2, canvas.height/2)
	let centerpieceRadius = minDim * 0.05
	console.log(centerpieceRadius, floorHeight)
	ctx.arc(center.x, center.y, centerpieceRadius , 0, 2*Math.PI)
	ctx.stroke()

	for (let floor of maze.floors) {
		ctx.beginPath()
		ctx.arc(center.x, center.y, centerpieceRadius + floor.floorId * floorHeight, 0, 2*Math.PI)
		ctx.stroke()

		let initialLowPoint = new Geometry.Point(center.x, center.y + centerpieceRadius + (floor.floorId - 1) * floorHeight)
		let initialHighPoint = new Geometry.Point(center.x, center.y + centerpieceRadius + floor.floorId * floorHeight)
		let currentLowPoint = initialLowPoint
		let currentHighPoint = initialHighPoint
		let angle = 360 / floor.rooms.length

		for (let i = 1;  i <= floor.rooms.length; i++) {
			ctx.moveTo(currentLowPoint.x, currentLowPoint.y)
			ctx.lineTo(currentHighPoint.x, currentHighPoint.y)
			ctx.stroke()
			currentLowPoint = initialLowPoint.rotateAlong(angle * i, center)
			currentHighPoint = initialHighPoint.rotateAlong(angle * i, center)
		}
	}
}