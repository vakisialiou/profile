import { Vector3, Object3D } from 'three'

export class Object3DPusher extends Vector3 {
  /**
   * Движение объекта в сторону текущего направления этого объекта.
   *
   * @param {number} speed
   * @param {Object3D} object
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
     * @type {boolean}
     */
    this.enabled = true
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

    // move forward parallel to the xz-plane
    // assumes person.up is y-up

    this.setFromMatrixColumn(this.object.matrix, 0)
    this.crossVectors(this.object.up, this)
    this.object.position.addScaledVector(this, this.speed * delta)
  }
}

export default Object3DPusher