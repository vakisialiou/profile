import { Vector3 } from 'three'

class Object3DMath {
  constructor() {

    /**
     *
     * @type {Vector3}
     */
    this.tmpPos = new Vector3()

    /**
     *
     * @type {Vector3}
     */
    this.tmpDir = new Vector3()
  }

  /**
   *
   * @param {(Object3D|Mesh|Group)} objPos - object from which to draw position
   * @param {(Object3D|Mesh|Group)} objDir - object from which to draw direction
   * @returns {Vector3}
   */
  getNextPoint(objPos, objDir) {
    const p = objPos.getWorldPosition(this.tmpPos).clone()
    const d = objDir.getWorldDirection(this.tmpDir).clone().setLength(-20)
    return p.add(d)
  }
}

export default Object3DMath