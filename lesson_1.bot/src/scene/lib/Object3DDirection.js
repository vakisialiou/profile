import { Vector3, Object3D } from 'three'

export class Object3DDirection {

  /**
   *
   * @param {Object3D} object
   */
  constructor(object) {
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
    return this.tmp.applyQuaternion(this.object.quaternion)
  }
}

export default Object3DDirection