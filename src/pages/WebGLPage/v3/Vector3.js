
export default class Vector3 {
  /**
   *
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [z]
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.isVector3 = true
  }

  /**
   *
   * @returns {number}
   */
  getX() {
    return this.x
  }

  /**
   *
   * @returns {number}
   */
  getY() {
    return this.y
  }

  /**
   *
   * @returns {number}
   */
  getZ() {
    return this.z
  }

  /**
   *
   * @param {number} x
   * @returns {Vector3}
   */
  setX(x) {
    this.x = x
    return this
  }

  /**
   *
   * @param {number} y
   * @returns {Vector3}
   */
  setY(y) {
    this.y = y
    return this
  }

  /**
   *
   * @param {number} z
   * @returns {Vector3}
   */
  setZ(z) {
    this.z = z
    return this
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  /**
   *
   * @returns {Vector3}
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z)
  }

  /**
   *
   * @param {Object|Vector3} v
   * @returns {Vector3}
   */
  copy(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }

  /**
   *
   * @returns {number}
   */
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  /**
   *
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.lengthSquared())
  }

  /**
   *
   * @returns {Vector3}
   */
  normalize() {
    return this.divideScalar(this.length() || 1)
  }

  /**
   *
   * @param {Object|Vector3} a
   * @param {Object|Vector3} b
   * @returns {Vector3}
   */
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z
    const bx = b.x, by = b.y, bz = b.z
    this.x = ay * bz - az * by
    this.y = az * bx - ax * bz
    this.z = ax * by - ay * bx
    return this
  }

  /**
   *
   * @param {Object|Vector3} v
   * @returns {Vector3}
   */
  cross(v) {
    return this.crossVectors(this, v)
  }

  /**
   *
   * @param {Object|Vector3} a
   * @param {Object|Vector3} b
   * @returns {Vector3}
   */
  subVectors(a, b) {
    this.x = a.x - b.x
    this.y = a.y - b.y
    this.z = a.z - b.z
    return this
  }

  /**
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  multiplyScalar(scalar) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    return this
  }

  /**
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar)
  }

  /**
   *
   * @param {Array} array
   * @param {number} [offset]
   * @returns {Vector3}
   */
  fromArray(array, offset = 0) {
    this.x = array[offset]
    this.y = array[offset + 1]
    this.z = array[offset + 2]
    return this
  }

  /**
   *
   * @param {Array} [array]
   * @param {number} [offset]
   * @returns {Array}
   */
  toArray(array = [], offset = 0) {
    array[offset] = this.x
    array[offset + 1] = this.y
    array[offset + 2] = this.z
    return array
  }
}