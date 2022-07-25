export interface IPoint {
  x: number,
  y: number
}

export interface IPolarPoint {
  r: number
  angle: number
}

export function toCartesian({r, angle}: IPolarPoint): IPoint {
  return {
    x: r*Math.cos(angle),
    y: r*Math.sin(angle)
  }
}

export class Point implements IPoint {
  x: number
  y: number

  constructor(x: number, y: number)
  constructor(point: IPoint)
  constructor(...args: any) {
    if (!args.length) {
      this.x = 0
      this.y = 0
    } else if (typeof args[0] == "number") {
      this.x = args[0]
      this.y = args[1] || 0
    } else {
      this.x = args[0].x
      this.y = args[0].y
    }
  }

  relativeTo(point: IPoint) {
    return new Point(this.x - point.x, this.y - point.y)
  }

  rotate(angle: number) {
    let θ = d2r(angle)
    this.x = (this.x * Math.cos(θ) - this.y * Math.sin(θ))
    this.y = (this.x * Math.sin(θ) + this.y * Math.cos(θ))
    return this
  }

  rotateAlong(angle: number, anchor: IPoint) {
    let relativePoint = this.relativeTo(anchor)
    let currentAngle = 0
    for (let i = 0; i < Math.abs(angle) / 0.1; i++) {
      let toRotate = (angle / Math.abs(angle)) * 0.1
      relativePoint.rotate(toRotate)
      currentAngle += toRotate
    }
    relativePoint.rotate(angle - currentAngle)
    relativePoint.x += anchor.x
    relativePoint.y += anchor.y
    return relativePoint
  }

  distanceFrom(point: IPoint): number
  distanceFrom(line: Line): number
  distanceFrom(target: IPoint | Line) {
    if (target instanceof Line) {
      let coeff = 0
      if (Math.abs(target.coeffA) == Infinity) {
        coeff = Math.abs(this.x - target.A.x)
      } else if (Math.abs(target.coeffA) == 0) {
        coeff = Math.abs(this.y + target.coeffB)
      } else {
        coeff = Math.abs(this.x + (1 / target.coeffA) * this.y + (1 / target.coeffA) * target.coeffB) / Math.sqrt((1 / target.coeffA) ** 2 + 1)
      }
      return coeff
    } else return Math.sqrt((this.x - target.x) ** 2 + (this.y - target.y) ** 2)
  }
}

export class Line {
  A: Point
  B: Point
  coeffA: number
  coeffB: number

  constructor(a: Point, b: Point) {
    this.A = a
    this.B = b
    this.coeffA = (b.y - a.y) / (a.x - b.x)
    this.coeffB = -a.y - a.x * this.coeffA
  }

  evalEquation(x: number) {
    return (x * this.coeffA + this.coeffB) * -1
  }
}

export function d2r(degrees: number) {
  return degrees * Math.PI / 180
}
