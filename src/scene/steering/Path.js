
export default class Path {
  constructor() {
    /**
     *
     * @type {Array.<Vector3>}
     * @private
     */
    this._points = []

    /**
     *
     * @type {number}
     * @private
     */
    this._index = 0

    /**
     *
     * @type {boolean}
     * @private
     */
    this._increase = true

    /**
     *
     * @type {string}
     * @private
     */
    this._type = Path.TYPE_LAZY
  }

  /**
   * Reach the last point and stop.
   *
   * @type {string}
   */
  static TYPE_LAZY = 'LAZY'

  /**
   * Reach the last then take first point.
   *
   * @type {string}
   */
  static TYPE_LOOP_FORWARD = 'TYPE_LOOP_FORWARD'

  /**
   * Reach the last then take previous point.
   * Reach the first then take next point.
   *
   * @type {string}
   */
  static TYPE_LOOP_BACKWARD = 'TYPE_LOOP_BACKWARD'

  /**
   *
   * @param {string} value - Use constants of class (Path.TYPE_LAZY|Path.TYPE_LOOP_BACKWARD|Path.TYPE_LOOP_FORWARD)
   * @returns {Path}
   */
  type(value) {
    this._type = value
    return this
  }

  /**
   *
   * @returns {Array<Vector3>}
   */
  getPoints() {
    return this._points
  }

  /**
   *
   * @param {Vector3} point
   * @returns {Path}
   */
  add(point) {
    this._points.push(point.clone())
    return this
  }

  /**
   *
   * @returns {Path}
   */
  advance() {
    if (this._points.length === 0) {
      return this
    }

    if (this._points.length === 1) {
      this._index = 0
      return this
    }

    if (this._type !== Path.TYPE_LOOP_BACKWARD) {
      this._increase = true
    }

    // increase or reduce index
    this._index = this._increase ? this._index + 1 : this._index - 1

    if (this._type === Path.TYPE_LOOP_BACKWARD) {
      if (this._index === this._points.length) {
        this._increase = false
        this._index = this._points.length - 2 // set index of previous point.
      }

      if (this._index === -1) {
        this._increase = true
        this._index = 1 // set index of second point.
      }
      return this
    }

    if (this._type === Path.TYPE_LAZY && this._index === this._points.length) {
      this._index-- // set index of last point.
      return this
    }

    if (this._type === Path.TYPE_LOOP_FORWARD && this._index === this._points.length) {
      this._index = 0 // set index of first point.
    }
    return this
  }

  /**
   *
   * @returns {Path}
   */
  clear() {
    this._points = []
    this._index = 0
    return this
  }

  /**
   *
   * @returns {Vector3|?}
   */
  current() {
    return this._points[this._index] || null
  }

  /**
   * Return TRUE always if does not have points or if point is only one.
   * Returns TRUE if this path is not looped and the last point is active.
   * Return FALSE always if allowed come back.
   *
   * @returns {boolean}
   */
  finished() {
    if ([0, 1].includes(this._points.length)) {
      return true
    }
    if (this._type === Path.TYPE_LOOP_BACKWARD) {
      return false
    }
    return this._type === Path.TYPE_LAZY && this._points.length === (this._index + 1)
  }
}