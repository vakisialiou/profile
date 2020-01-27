import {
  Group,
  MeshBasicMaterial,
  BoxGeometry,
  Mesh, Vector3,
} from 'three'
import { Object3DFollower, Object3DMover } from './lib'

export default class Bot extends Group {
  constructor(options = {}) {
    super()

    /**
     *
     * @type {Array.<Vector3>}
     */
    this.path = []

    /**
     *
     * @type {BoxGeometry}
     */
    this.botGeometry = new BoxGeometry(4, 12, 2)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.botMaterial = new MeshBasicMaterial({ color: options.color || 0xFFFFFF })

    /**
     *
     * @type {Mesh}
     */
    this.botMesh = new Mesh(this.botGeometry, this.botMaterial)

    /**
     *
     * @type {Object3DFollower}
     */
    this.folower = new Object3DFollower(this, 2.5)

    /**
     *
     * @type {Object3DMover}
     */
    this.mover = new Object3DMover(this, 10)
  }

  /**
   *
   * @param {Array.<Vector3>} path
   * @returns {Bot}
   */
  setPath(path) {
    this.path = Array.from(path)
    return this
  }

  /**
   *
   * @returns {Bot}
   */
  render() {
    this.add(this.botMesh)
    return this
  }

  /**
   *
   * @param {number} delta
   */
  update(delta) {
    if (this.path.length > 0) {
      const target = this.path[0]
      this.folower.setTarget(target).update(delta)
      this.mover.setTarget(target).update(delta)
      if (this.mover.isTargetReached) {
        this.path.splice(0, 1)
      }
    }
  }
}