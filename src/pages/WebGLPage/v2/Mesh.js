import Vector2 from '@/pages/WebGLPage/v1/Vector2'

export default class Mesh {
  /**
   *
   * @param {Geometry} geometry
   * @param {Material} material
   */
  constructor(geometry, material) {

    /**
     *
     * @type {Geometry}
     */
    this.geometry = geometry

    /**
     *
     * @type {Material}
     */
    this.material = material

    /**
     *
     * @type {Vector2}
     */
    this.position = new Vector2()

    /**
     *
     * @type {Vector2}
     */
    this.scale = new Vector2(1, 1, 1)

    /**
     *
     * @type {number}
     */
    this.rotationAngle = 0
  }
}