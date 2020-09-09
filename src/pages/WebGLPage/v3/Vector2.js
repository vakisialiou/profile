
export default class Vector2 {
  /**
   *
   * @param {number} [x]
   * @param {number} [y]
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
    this.isVector2 = true
  }

  /**
   *
   * @return {number}
   */
  getX() {
    return this.x
  }

  /**
   *
   * @return {number}
   */
  getY() {
    return this.y
  }

  /**
   *
   * @param {number} x
   * @returns {Vector2}
   */
  setX(x) {
    this.x = x
    return this
  }

  /**
   *
   * @param {number} y
   * @returns {Vector2}
   */
  setY(y) {
    this.y = y
    return this
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {Vector2}
   */
  set(x, y) {
    this.x = x
    this.y = y
    return this
  }

  /**
   *
   * @return {Vector2}
   */
  clone() {
    return new this.constructor(this.x, this.y)
  }

  /**
   *
   * @param {Object|Vector2} v
   * @return {Vector2}
   */
  copy(v) {
    this.x = v.x
    this.y = v.y
    return this
  }

  /**
   *
   * @param {Array} array
   * @param {number} [offset]
   * @return {Vector2}
   */
  fromArray(array, offset = 0) {
    this.x = array[offset]
    this.y = array[offset + 1]
    return this
  }

  /**
   *
   * @param {Array} [array]
   * @param {number} [offset]
   * @return {Array}
   */
  toArray(array = [], offset = 0) {
    array[offset] = this.x
    array[offset + 1] = this.y
    return array
  }
}