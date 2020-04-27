import { PointsMaterial, BufferGeometry, Points } from 'three'

export default class HelperGridVertices extends Points {
  /**
   *
   * @param {Ground} ground
   */
  constructor(ground) {
    super()

    /**
     *
     * @type {PointsMaterial}
     */
    this.material = new PointsMaterial({ color: 0xFFFFFF, size: 1, alphaTest: 0.5 })

    /**
     *
     * @type {BufferGeometry}
     */
    this.geometry = new BufferGeometry().setFromPoints(ground.cover.geometry.vertices)
    this.quaternion.copy(ground.cover.quaternion)
    this.position.setY(1)
  }
}