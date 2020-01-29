import { Vector3, Object3D } from 'three'

export class Object3DMover2 extends Vector3 {
  /**
   * Движение объекта в заданном направлении.
   *
   * @param {Object3D} object
   * @param {Vector3} direction
   * @param {number} [speed]
   */
  constructor(object, direction, speed = 20) {
    super()

    /**
     *
     * @type {Object3D}
     */
    this.object = object

    /**
     *
     * @type {number}
     */
    this.speed = speed

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3().copy(direction)

    /**
     *
     * @type {boolean}
     */
    this.enabled = true
  }

  /**
   *
   * @param {Vector3} vector
   * @return {Object3DMover2}
   */
  setDirection(vector) {
    if (!this.direction.equals(vector)) {
      this.direction.copy(vector)
    }
    return this
  }

  /**
   *
   * @param {number} delta
   * @return {void}
   */
  update(delta) {
    if (!this.enabled || this.speed === 0) {
      return
    }

    // const velocity = this.subVectors(this.target, this.object.position).normalize()
    this.object.position.addScaledVector(this.direction, this.speed * delta)
  }
}

export default Object3DMover2