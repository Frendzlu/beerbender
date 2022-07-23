import {Geometry} from "./Geometry";
import Point = Geometry.Point;
import {World} from "./World";

let x = new World({
	floorAmount: 6,
	floorOptions: {
		minimalRoomSize: 1/12,
		roomNumberMultiplier: 2,
		initialRoomNumber: 4
	}
})
console.log(x)

let canvas = document.getElementById("testCanvas") as HTMLCanvasElement

render(x, canvas)


function render(world: World, canvas: HTMLCanvasElement) {
	let ctx = canvas.getContext("2d", { alpha: false })!
	let minDim = (canvas.width < canvas.height ? canvas.width : canvas.height)
	let floorHeight = ((minDim * 0.90) / 2) / (world.floorAmount + 1)
	let center = new Point(canvas.width / 2, canvas.height/2)
	let centerpieceRadius = floorHeight
	console.log(centerpieceRadius, floorHeight)

	ctx.fillStyle = "white"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.strokeStyle = "black"
	ctx.arc(center.x, center.y, centerpieceRadius , 0, 2*Math.PI)
	ctx.stroke()
	let marked = false

	for (let floor of world.floors) {

		let initialLowPoint = new Geometry.Point(center.x, center.y - (centerpieceRadius + (floor.floorNumber - 1) * floorHeight))
		let initialHighPoint = new Geometry.Point(center.x, center.y - (centerpieceRadius + floor.floorNumber * floorHeight))
		let angle = 360 / floor.rooms.length
		let currentLeftLowPoint = initialLowPoint
		let currentLeftHighPoint = initialHighPoint
		let currentRightLowPoint = initialLowPoint.rotateAlong(angle, center)
		let currentRightHighPoint = initialHighPoint.rotateAlong(angle, center)

		for (let i = 1;  i <= floor.rooms.length; i++) {

			const room = floor.rooms[i-1]
			if(!marked){
				// marked = true
				// helper green open mark
				// ctx.beginPath()
				// ctx.arc(currentLeftLowPoint.x + 10, currentLeftLowPoint.y - 10, 5, 0, 2*Math.PI)
				// ctx.strokeStyle = "green"
				// ctx.stroke()

				for (let con of room.connections){
					ctx.beginPath()
					if(con.roomId.floorNumber === floor.floorNumber){
						// left wall
						if(((i > 1 && con.roomId.roomNumber === i - 1) || (i === 1 && con.roomId.roomNumber === floor.rooms.length)) && !con.isOpen){
							ctx.moveTo(currentLeftLowPoint.x, currentLeftLowPoint.y)
							ctx.lineTo(currentLeftHighPoint.x, currentLeftHighPoint.y)

						}
						// right wall
						if(((i < floor.rooms.length && con.roomId.roomNumber === i + 1) || (i === floor.rooms.length && con.roomId.roomNumber === 1)) && !con.isOpen){
							ctx.moveTo(currentRightLowPoint.x, currentRightLowPoint.y)
							ctx.lineTo(currentRightHighPoint.x, currentRightHighPoint.y)
						}
					}
					// inward wall
					if(con.roomId.floorNumber < floor.floorNumber && !con.isOpen){
						ctx.arc(center.x, center.y, centerpieceRadius + (floor.floorNumber - 1) * floorHeight,
							Geometry.d2r(angle * (i-1)) - Math.PI/2,
							Geometry.d2r(angle * i)- Math.PI/2)
					}
					// outward wall
					if(con.roomId.floorNumber > floor.floorNumber && !con.isOpen){
						ctx.arc(center.x, center.y, centerpieceRadius + floor.floorNumber * floorHeight,
							Geometry.d2r(angle * (i-1)) - Math.PI/2,
							Geometry.d2r(angle * i)- Math.PI/2)
					}
					ctx.strokeStyle = "black"
					ctx.stroke()

					if(con.isOpen) {
						let destLowPoint = new Geometry.Point(center.x, center.y - (centerpieceRadius + (con.roomId.floorNumber - 1) * floorHeight))
						destLowPoint = destLowPoint.rotateAlong(360 / world.floors[con.roomId.floorNumber - 1].rooms.length * (con.roomId.roomNumber - 1), center)

						// helper red open mark
						// ctx.beginPath()
						// ctx.arc(destLowPoint.x + 10, destLowPoint.y - 10, 5, 0, 2*Math.PI)
						// ctx.strokeStyle = "red"
						// ctx.stroke()
					}

				}

			}

			ctx.beginPath()
			ctx.strokeStyle = "black"
			// top floor outward
			if(floor.floorNumber === world.floorAmount){
				ctx.arc(center.x, center.y, centerpieceRadius + floor.floorNumber * floorHeight,
					Geometry.d2r(angle * (i-1)) - Math.PI/2,
					Geometry.d2r(angle * i)- Math.PI/2)
			}
			ctx.stroke()

			currentLeftLowPoint = initialLowPoint.rotateAlong(angle * i, center)
			currentLeftHighPoint = initialHighPoint.rotateAlong(angle * i, center)
			currentRightLowPoint = initialLowPoint.rotateAlong(angle * (i + 1), center)
			currentRightHighPoint = initialHighPoint.rotateAlong(angle * (i + 1), center)
		}
	}
}