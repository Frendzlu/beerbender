import {Geometry} from "./Geometry";
import Point = Geometry.Point;
import {World} from "./World";

let x = new World({
	floorAmount: 17,
	floorOptions: {
		minimalRoomSize: 1/8,
		roomNumberMultiplier: 2,
		initialRoomNumber: 6
	}
})
console.log(x)

let canvas = document.getElementById("testCanvas") as HTMLCanvasElement

render(x, canvas)


function render(world: World, canvas: HTMLCanvasElement) {
	let ctx = canvas.getContext("2d")!
	let minDim = (canvas.width < canvas.height ? canvas.width : canvas.height)
	let floorHeight = ((minDim * 0.90) / 2) / world.floorAmount
	let center = new Point(canvas.width / 2, canvas.height/2)
	let centerpieceRadius = minDim * 0.05
	console.log(centerpieceRadius, floorHeight)
	ctx.arc(center.x, center.y, centerpieceRadius , 0, 2*Math.PI)
	ctx.stroke()

	for (let floor of world.floors) {
		ctx.beginPath()
		ctx.arc(center.x, center.y, centerpieceRadius + floor.floorNumber * floorHeight, 0, 2*Math.PI)
		ctx.stroke()

		let initialLowPoint = new Geometry.Point(center.x, center.y - (centerpieceRadius + (floor.floorNumber - 1) * floorHeight))
		let initialHighPoint = new Geometry.Point(center.x, center.y - (centerpieceRadius + floor.floorNumber * floorHeight))
		let currentLowPoint = initialLowPoint
		let currentHighPoint = initialHighPoint
		let angle = 360 / floor.rooms.length

		for (let i = 1;  i <= floor.rooms.length; i++) {
			ctx.beginPath()
			ctx.moveTo(currentLowPoint.x, currentLowPoint.y)
			ctx.lineTo(currentHighPoint.x, currentHighPoint.y)
			ctx.stroke()
			ctx.beginPath()
			ctx.strokeStyle = "red"
			if (i == 1) ctx.arc(currentLowPoint.x + 10, currentLowPoint.y - 10, 5, 0, 2*Math.PI)
			ctx.stroke()
			ctx.strokeStyle = "black"
			currentLowPoint = initialLowPoint.rotateAlong(angle * i, center)
			currentHighPoint = initialHighPoint.rotateAlong(angle * i, center)
		}
	}
}