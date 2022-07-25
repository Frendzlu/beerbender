export interface IPoint {
  x: number,
  y: number,
}

export function toCartesian({r, angle}: IPolarPoint): Point {
  return new Point(
    r * Math.cos(angle),
    r * Math.sin(angle)
  )
}

export interface IPolarPoint {
  r: number
  angle: number
}

export class PolarPoint implements IPolarPoint {
  angle: number;
  r: number;

  constructor(point: IPolarPoint)
  constructor(r: number, angle: number)
  constructor(...args: any) {
    if (!args.length) {
      this.r = 0
      this.angle = 0
    } else if (typeof args[0] == "number") {
      this.r = args[0]
      this.angle = args[1] || 0
    } else {
      this.r = args[0].r
      this.angle = args[0].angle
    }
  }

  timesScalar(k: number): PolarPoint {
    const p = new PolarPoint(this)
    p.r *= k
    return p;
  }

  timesAngle(angle: number): PolarPoint {
    const p = new PolarPoint(this)
    p.angle *= angle
    return p;
  }

  timesScalarAndAngle(k: number, angle: number): PolarPoint {
    const p = new PolarPoint(this)
    p.angle *= angle
    p.r *= k
    return p;

  }

  static fromCartesian({x, y}: IPoint): PolarPoint {
    return new PolarPoint({
      r: Math.sqrt(x * x + y * y),
      angle: 1 / Math.tan(y / x)
    })
  }

  toCartesian(): Point {
    return new Point(
      this.r * Math.cos(this.angle),
      this.r * Math.sin(this.angle)
    )
  }

}

export class Point implements IPoint {
  x: number
  y: number

  toTuple(): [number, number] {
    return [this.x, this.y]
  }

  timesScalar(k: number) {
    const p = new Point(this)
    p.x *= k
    p.y *= k
    return p
  }

  constructor(point: IPoint)
  constructor(x: number, y: number)
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
    const theta = d2r(angle)
    this.x = (this.x * Math.cos(theta) - this.y * Math.sin(theta))
    this.y = (this.x * Math.sin(theta) + this.y * Math.cos(theta))
    return this
  }

  add({x, y}: IPoint): Point {
    const p = new Point(this)
    p.x += x
    p.y += y
    return p
  }

  rotateAlong(angle: number, anchor: IPoint) {
    const relativePoint = this.relativeTo(anchor)
    let currentAngle = 0
    for (let i = 0; i < Math.abs(angle) / 0.1; i++) {
      const toRotate = (angle / Math.abs(angle)) * 0.1
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
