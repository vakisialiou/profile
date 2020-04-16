
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
    this._type = Path.TYPE_RELAX
  }

  /**
   * Reach the last point and stop.
   *
   * @type {string}
   */
  static TYPE_RELAX = 'RELAX'

  /**
   * Reach the last then take first point.
   *
   * @type {string}
   */
  static TYPE_LOOP = 'LOOP'

  /**
   * Reach the last then take previous point.
   * Reach the first then take next point.
   *
   * @type {string}
   */
  static TYPE_BACKWARD = 'BACKWARD'

  /**
   *
   * @param {string} value - Use constants of class (Path.TYPE_RELAX|Path.TYPE_BACKWARD|Path.TYPE_LOOP)
   * @returns {Path}
   */
  type(value) {
    this._type = value
    return this
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
    if (this._type === Path.TYPE_RELAX && this.points.length < (this.index + 1)) {
      this.index--
      return this
    }

    if (this._type === Path.TYPE_LOOP && this.points.length < (this.index + 1)) {
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
    if (this.points.length === 0) {
      return true
    }
    return this._type === Path.TYPE_RELAX && this.points.length === (this.index + 1)
  }
}