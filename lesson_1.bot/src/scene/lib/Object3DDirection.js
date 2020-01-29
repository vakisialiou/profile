import { Vector3, Object3D } from 'three'

export class Object3DDirection extends Vector3 {

  /**
   *
   * @param {Object3D} object
   */
  constructor(object) {
    super(0, 0, -1)

    /**
     *
     * @type {Object3D}
     */
    this.object = object

    /**
     *
     * @type {Vector3}
     */
    this.tmp = new Vector3()
  }

  /**
   *
   * @returns {Vector3}
   */
  get() {
    return this.tmp.copy(this).applyQuaternion(this.object.quaternion)
  }
}

export default Object3DDirection