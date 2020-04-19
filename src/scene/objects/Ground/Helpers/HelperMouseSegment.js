import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three'

export default class HelperMouseSegment extends Mesh {
  /**
   *
   * @param {Ground} ground
   */
  constructor(ground) {
    super()

    const size = ground.options.pointSize

    /**
     *
     * @type {BoxBufferGeometry}
     */
    this.geometry = new BoxBufferGeometry(size, size, size)

    /**
     *
     * @type {MeshStandardMaterial}
     */
    this.material = new MeshStandardMaterial({ color: 0x666666 })
    this.renderOrder = 1000
  }
}