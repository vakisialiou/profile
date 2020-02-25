import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

export default class Planet extends Mesh {
  /**
   *
   * @param {Texture} texture
   * @param {number} [size]
   */
  constructor(texture, size = 60) {
    super()

    /**
     *
     * @type {SphereGeometry}
     */
    this.geometry = new SphereGeometry(60, 32, 32)

    /**
     *
     * @type {MeshStandardMaterial}
     */
    this.material = new MeshStandardMaterial({ map: texture })
  }

  /**
   *
   * @param {Vector3} v
   * @returns {Planet}
   */
  setPosition(v) {
    this.position.copy(v)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Planet}
   */
  update(delta) {
    this.rotation.y += 0.0005
    return this
  }
}