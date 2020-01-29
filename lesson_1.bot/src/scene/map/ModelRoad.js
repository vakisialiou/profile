import { Geometry, Line, Vector3, Color, LineBasicMaterial } from 'three'

export default class ModelRoad extends Line {
  /**
   *
   * @param {string} name
   * @param {Array.<Vector3>} points
   * @param {string|number|Color} color
   */
  constructor(name, points, color) {
    super()

    /**
     *
     * @type {string}
     */
    this.name = name

    /**
     *
     * @type {Geometry}
     */
    this.geometry = new Geometry()

    /**
     *
     * @type {LineBasicMaterial}
     */
    this.material = new LineBasicMaterial({ color })

    this.setPath(points)
  }

  /**
   *
   * @returns {Array.<Vector3>}
   */
  get points() {
    return Array.from(this.geometry.vertices)
  }

  /**
   *
   * @param {Array.<Vector3>} points
   * @return {ModelRoad}
   */
  setPath(points) {
    this.geometry.vertices = []
    for (const point of points) {
      this.geometry.vertices.push(new Vector3().copy(point))
    }
    return this
  }
}