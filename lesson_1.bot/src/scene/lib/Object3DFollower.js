import { Vector3, Matrix4, Quaternion, Object3D } from 'three'

export class Object3DFollower {
  /**
   * Плавное направление объекта в сторону цели с заданной скоростью.
   *
   * @param {Object3D} object
   * @param {number} [speed]
   */
  constructor(object, speed = 0.5) {
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
     * @type {Matrix4}
     */
    this.rotationMatrix = new Matrix4()

    /**
     *
     * @type {Quaternion}
     */
    this.targetRotation = new Quaternion()

    /**
     *
     * @type {Vector3}
     */
    this.target = new Vector3()

    /**
     *
     * @type {Vector3}
     */
    this.tmp = new Vector3()

    /**
     *
     * @type {boolean}
     */
    this.enabled = true

    /**
     *
     * @type {boolean}
     */
    this.isRotationReached = true
  }

  /**
   *
   * @param {Object|Vector3} vector
   * @returns {Object3DFollower}
   */
  setTarget(vector) {
    if (this.target.equals(vector)) {
      return this
    }

    this.target.copy(vector)
    this.rotationMatrix.lookAt(this.object.position, this.target, this.object.up)
    this.targetRotation.setFromRotationMatrix(this.rotationMatrix)
    this.isRotationReached = false
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    if (!this.enabled || this.speed === 0 || this.isRotationReached) {
      return
    }

    this.object.quaternion.rotateTowards(this.targetRotation, this.speed * delta)
    if (this.object.quaternion.equals(this.targetRotation)) {
      // this.isRotationReached = true
    }
  }
}

export default Object3DFollower