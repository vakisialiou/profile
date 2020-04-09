import DisplacementFollow from '@scene/steering/modifiers/DisplacementFollow'
import { Vector3 } from 'three'

const target = new Vector3(0, 0, 0)

export default class DisplacementPush extends DisplacementFollow {
  /**
   * Push into object direction.
   */
  constructor() {
    super()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._tmpDirection = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._up = new Vector3(0, 0, -1)
  }

  /**
   *
   * @param {(Object3D|Group)} unit - Object to calculate displacement into him direction.
   * @returns {Vector3}
   */
  calculate(unit) {
    const velocity = super.calculate(unit.position, target)
    return this._tmpDirection.copy(this._up).applyQuaternion(unit.quaternion).multiplyScalar(velocity.length())
  }
}