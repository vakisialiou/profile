import { Matrix4, Quaternion } from 'three'

export default class RotationTowardsTarget {
  constructor() {
    /**
     *
     * @type {Matrix4}
     * @private
     */
    this._rotationMatrix = new Matrix4()

    /**
     *
     * @type {Quaternion}
     * @private
     */
    this._quaternionFrom = new Quaternion()

    /**
     *
     * @type {Quaternion}
     * @private
     */
    this._quaternionTo = new Quaternion()
  }

  /**
   *
   * @param {(Object3D|Group)} unit
   * @param {Vector3} target
   * @param {number} speed
   * @returns {Quaternion}
   */
  calculate(unit, target, speed) {
    this._quaternionTo.copy(unit.quaternion)
    this._rotationMatrix.lookAt(unit.position, target, unit.up)
    this._quaternionFrom.setFromRotationMatrix(this._rotationMatrix)

    if (!this._quaternionTo.equals(this._quaternionFrom)) {
      this._quaternionTo.rotateTowards(this._quaternionFrom, speed)
    }

    return this._quaternionTo
  }
}