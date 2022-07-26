import {World} from "./World";
import {Point, toCartesian} from "./Geometry";
import {PI2} from "./consts";

const x = new World({
	floorAmount: 100,
	worldOptions: {
		minimalCellSize: Math.PI / 3,
		cellNumberMultiplier: 2,
	},
	roomAmount: 800,
})
console.log(x)


const canvas = document.getElementById("testCanvas") as HTMLCanvasElement

render(x, canvas)


function render(world: World, canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext("2d", { alpha: false })!
	const minDim = (canvas.width < canvas.height ? canvas.width : canvas.height)
	const floorHeight = ((minDim * 0.90) / 2) / (world.floorAmount + 1)
	const center = new Point(canvas.width / 2, canvas.height / 2)

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.strokeStyle = "black"

	ctx.moveTo(center.x, center.y)
	ctx.lineTo(center.x + floorHeight * (world.floorAmount + 1), center.y)
	ctx.stroke()

	ctx.globalAlpha = 0.2
	world.cells.forEach((cells, i) => {
		cells.forEach((cell, j) => {
			ctx.strokeStyle = cell.color
			const {bottom, end, top, start} = cell.sides
			if (bottom) {
				ctx.beginPath()
				ctx.arc(center.x, center.y, i * floorHeight, PI2 * (j / cells.length), PI2 * ((j + 1) / cells.length))
				ctx.stroke()
			}
			if (end) {
				ctx.beginPath()
				const {x, y} = toCartesian({r: i * floorHeight, angle: PI2 * ((j + 1) / cells.length)})
				ctx.moveTo(center.x + x, center.y + y);
				const {x: x2, y: y2} = toCartesian({r: (i + 1) * floorHeight, angle: PI2 * ((j + 1) / cells.length)})
				ctx.lineTo(center.x + x2, center.y + y2)
				ctx.stroke()
			}
			if (top) {
				ctx.beginPath()
				ctx.arc(center.x, center.y, (i + 1) * floorHeight, PI2 * (j / cells.length), PI2 * ((j + 1) / cells.length))
				ctx.stroke()
			}
			if (start) {
				ctx.beginPath()
				const {x, y} = toCartesian({r: (i + 1) * floorHeight, angle: PI2 * (j / cells.length)})
				ctx.moveTo(center.x + x, center.y + y);
				const {x: x2, y: y2} = toCartesian({r: i * floorHeight, angle: PI2 * (j / cells.length)})
				ctx.lineTo(center.x + x2, center.y + y2)
				ctx.stroke()
			}
		})
	})

	ctx.beginPath()
	ctx.arc(center.x, center.y, floorHeight, 0, PI2)
	ctx.arc(center.x, center.y, floorHeight * (world.floorAmount + 1), 0, PI2)
	ctx.stroke()

	ctx.globalAlpha = 1

	ctx.strokeStyle = "red"
	ctx.fillStyle = "blue"

	world.rooms.forEach((room) => {
		const maxCellsOnFloor = world.cells[room.startFloor].length
		ctx.beginPath()
		ctx.arc(center.x, center.y, room.startFloor * floorHeight, PI2 * (room.startPos / maxCellsOnFloor), PI2 * (room.endPos / maxCellsOnFloor))
		const endTop = toCartesian({r: room.endFloor * floorHeight, angle: PI2 * (room.endPos / maxCellsOnFloor)})
		ctx.lineTo(center.x + endTop.x, center.y + endTop.y)
		ctx.arc(center.x, center.y, room.endFloor * floorHeight, PI2 * (room.endPos / maxCellsOnFloor), PI2 * (room.startPos / maxCellsOnFloor), true)
		const startBottom = toCartesian({r: room.startFloor * floorHeight, angle: PI2 * (room.startPos / maxCellsOnFloor)})
		ctx.lineTo(center.x + startBottom.x, center.y + startBottom.y)
		ctx.stroke()

		ctx.beginPath()
		const roomCenter = toCartesian({r: room.center.r * floorHeight, angle: room.center.angle * PI2})
		ctx.arc(center.x + roomCenter.x, center.y + roomCenter.y, 2, 0, PI2)
		ctx.fill()
	})
}