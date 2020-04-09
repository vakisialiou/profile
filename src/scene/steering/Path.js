
export default class Path {
  constructor() {
    /**
     *
     * @type {Array.<Vector3>}
     */
    this.points = []

    /**
     *
     * @type {number}
     */
    this.index = 0

    /**
     *
     * @type {boolean}
     */
    this.loop = false
  }

  /**
   *
   * @param {Vector3} point
   * @returns {Path}
   */
  add(point) {
    this.points.push(point.clone())
    return this
  }

  /**
   *
   * @returns {Path}
   */
  advance() {
    if (this.points.length === 0) {
      return this
    }

    this.index++

    if (this.loop === false && this.points.length < (this.index - 1)) {
      this.index--
      return this
    }

    if (this.loop === true && this.points.length < (this.index - 1)) {
      this.index = 0
    }
    return this
  }

  /**
   *
   * @returns {Path}
   */
  clear() {
    this.points = []
    this.index = 0
    return this
  }

  /**
   *
   * @returns {Vector3|?}
   */
  current() {
    return this.points[this.index] || null
  }

  /**
   * Returns true if this path is not looped and the last point is active.
   *
   * @returns {boolean}
   */
  finished() {
    return this.loop === false && this.points.length === this.index
  }
}