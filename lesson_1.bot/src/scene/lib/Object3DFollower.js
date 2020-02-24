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
     * @private
     */
    this._tmp1 = new Vector3()
    this._tmp2 = new Vector3()

    /**
     *
     * @type {Vector3}
     */
    this._useObjectAxis = new Vector3(0, 0, 0)

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
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Object3DFollower}
   */
  useObjectAxis(x, y, z) {
    this._useObjectAxis.set(x, y, z)
    return this
  }

  /**
   *
   * @param {Object|Vector3} vector
   * @returns {Object3DFollower}
   */
  setTarget(vector) {
    const position = this.object.getWorldPosition(this._tmp1)
    this._tmp2.setX(this._useObjectAxis.x === 1 ? position.x : vector.x)
    this._tmp2.setY(this._useObjectAxis.y === 1 ? position.y : vector.y)
    this._tmp2.setZ(this._useObjectAxis.z === 1 ? position.z : vector.z)

    if (this.target.equals(this._tmp2)) {
      return this
    }

    this.target.copy(this._tmp2)
    this.rotationMatrix.lookAt(position, this.target, this.object.up)
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
      this.isRotationReached = true
    }
  }
}

export default Object3DFollower