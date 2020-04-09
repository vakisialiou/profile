import { Vector3 } from 'three'

export default class DisplacementFollow {

  constructor() {

    /**
     *
     * @type {number}
     * @private
     */
    this._maxSpeed = 1.5

    /**
     *
     * @type {number}
     * @private
     */
    this._tolerance = 0.1

    /**
     *
     * @type {number}
     * @private
     */
    this._deceleration = 0.8

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._displacement = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._desiredVelocity = new Vector3()
  }

  /**
   *
   * @param {number} value
   * @returns {DisplacementFollow}
   */
  setMaxSpeed(value) {
    this._maxSpeed = value
    return this
  }

  /**
   * A tolerance value in world units to prevent the point from overshooting its target.
   *
   * @param {number} value
   * @returns {DisplacementFollow}
   */
  setTolerance(value) {
    this._tolerance = value
    return this
  }

  /**
   *
   * @param {number} value
   * @returns {DisplacementFollow}
   */
  setDeceleration(value) {
    this._deceleration = value
    return this
  }

  /**
   *
   * @param {Vector3} position - Position of object to calculate displacement.
   * @param {Vector3} target - Position of target to calculate displacement direction.
   * @returns {Vector3}
   */
  calculate(position, target) {
    this._displacement.subVectors(target, position)
    const distance = this._displacement.length()

    if (distance > this._tolerance) {
      // calculate the speed required to reach the target given the desired deceleration
      let speed = distance / this._deceleration

      // make sure the speed does not exceed the max
      speed = Math.min(speed, this._maxSpeed) / distance
      this._desiredVelocity.copy(this._displacement).multiplyScalar(speed)
    } else {
      this._desiredVelocity.set(0, 0, 0)
    }
    return this._desiredVelocity
  }
}