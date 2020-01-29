import { Vector3, Object3D } from 'three'

export class Object3DMover1 extends Vector3 {
  /**
   * Движение объекта в сторону цели.
   * При достижении цели объет останавливается.
   * При изменении цели объект продолжает движение.
   *
   * @param {Object3D} object
   * @param {number} [speed]
   */
  constructor(object, speed = 20) {
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
    this.target = new Vector3()

    /**
     *
     * @type {boolean}
     */
    this.enabled = true

    /**
     *
     * @type {boolean}
     */
    this.isTargetReached = false

    /**
     *
     * @type {number|?}
     */
    this.prevPathLength = null
  }

  /**
   *
   * @param {Vector3} vector
   * @return {Object3DMover1}
   */
  setTarget(vector) {
    if (!this.target.equals(vector)) {
      this.target.copy(vector)
      this.isTargetReached = false
      this.prevPathLength = null
    }
    return this
  }

  /**
   *
   * @param {number} delta
   * @return {void}
   */
  update(delta) {
    if (!this.enabled || this.speed === 0 || this.isTargetReached) {
      return
    }

    const velocity = this.subVectors(this.target, this.object.position).normalize()
    this.object.position.addScaledVector(velocity, this.speed * delta)
    const currentPathLength = this.object.position.distanceTo(this.target)
    if (this.prevPathLength && this.prevPathLength <= currentPathLength) {
      this.object.position.copy(this.target)
      this.isTargetReached = true
    }
    this.prevPathLength = currentPathLength
  }
}

export default Object3DMover1