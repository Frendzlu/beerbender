import {IPoint, Point} from "./Point";

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