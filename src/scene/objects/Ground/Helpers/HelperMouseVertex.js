import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

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
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: 0x000000 })
  }
}