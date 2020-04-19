import { SphereGeometry, MeshStandardMaterial, Mesh } from 'three'

export default class HelperMouseVertex extends Mesh {
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
    this.geometry = new SphereGeometry(size / 8, 16, 16)

    /**
     *
     * @type {MeshStandardMaterial}
     */
    this.material = new MeshStandardMaterial({ color: 0x000000 })
  }
}