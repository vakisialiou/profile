import {Math as _Math, Vector3} from 'three'

class Vector3Helper extends Vector3 {
  constructor(x, y, z) {
    super(x, y, z)

    this.axis = new Vector3(0, 1, 0)
    this.tmp = new Vector3(0, 1, 0)
  }

  applyNextPosition(position, direction, len) {
    this.copy(position)
    const step = this.tmp.copy(direction).setLength(len).setY(1)
    return this.add(step).clone()
  }

  applyAngle(direction, deg) {
    return direction.applyAxisAngle(this.axis, _Math.degToRad(deg))
  }
}

export default Vector3Helper