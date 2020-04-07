import { Quaternion, Vector3 } from 'three'

export default class RotationTowardsAngle {
  constructor() {

    /**
     *
     * @type {Vector3}
     */
    this.axis = new Vector3(0, 1, 0)

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
   * @param {Quaternion} quaternion
   * @param {number} angle
   * @param {number} speed
   * @returns {Quaternion}
   */
  calculate(quaternion, angle, speed) {
    this._quaternionTo.copy(quaternion)
    this._quaternionFrom.setFromAxisAngle(this.axis, angle)

    if (!this._quaternionTo.equals(this._quaternionFrom)) {
      this._quaternionTo.rotateTowards(this._quaternionFrom, speed)
    }

    return this._quaternionTo
  }
}