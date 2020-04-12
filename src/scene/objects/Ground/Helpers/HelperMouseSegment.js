import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'three'

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
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: 0xFF0000, opacity: 0.5, transparent: true })
  }
}