
export default class Color {
  /**
   *
   * @param {number} [r]
   * @param {number} [g]
   * @param {number} [b]
   */
  constructor(r = 0, g = 0, b = 0) {
    this.r = r
    this.g = g
    this.b = b

    /**
     *
     * @type {boolean}
     */
    this.isColor = true
  }

  /**
   *
   * @param {Color|number|string} value
   * @returns {Color}
   */
  set(value) {
    if (typeof value === 'object') {

      this.copy(value)

    } else if (typeof value === 'number') {

      this.setHex(value)

    } else if (typeof value === 'string') {

      this.setStyle( value )

    }
    return this
  }

  /**
   *
   * @param {string} style
   */
  setStyle(style) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    style = style.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(style)
    this.r = parseInt(result[1], 16)
    this.g = parseInt(result[2], 16)
    this.b = parseInt(result[3], 16)
    return this
  }

  /**
   *
   * @param {number} hex
   * @returns {Color}
   */
  setHex(hex) {
    hex = Math.floor(hex)
    this.r = (hex >> 16 & 255) / 255
    this.g = (hex >> 8 & 255) / 255
    this.b = (hex & 255) / 255
    return this
  }

  /**
   *
   * @returns {number}
   */
  getHex() {
    return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0
  }

  /**
   *
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {Color}
   */
  setRGB(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
    return this
  }

  /**
   * ranges are in 0.0 - 1.0
   *
   * @param {Array} arr
   * @param {number} [offset]
   * @returns {Color}
   */
  fromNormalizedArray(arr, offset = 0) {
    this.r = arr[offset] * 255
    this.g = arr[offset + 1] * 255
    this.b = arr[offset + 2] * 255
    return this
  }

  /**
   * ranges are in 0.0 - 1.0
   *
   * @param {Array} [target]
   * @param {number} [offset]
   * @return {Array}
   */
  toNormalizedArray(target = [], offset = 0) {
    target[offset] = (this.r - Math.min(0, this.r)) / (Math.max(255, this.r) - Math.min(0, this.r))
    target[offset + 1] = (this.g - Math.min(0, this.g)) / (Math.max(255, this.g) - Math.min(0, this.g))
    target[offset + 2] = (this.b - Math.min(0, this.b)) / (Math.max(255, this.b) - Math.min(0, this.b))
    return target
  }

  /**
   *
   * @param {Object|Color} color
   * @returns {Color}
   */
  copy(color) {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    return this
  }

  /**
   *
   * @returns {Color}
   */
  clone() {
    return new this.constructor(this.r, this.g, this.b)
  }

  /**
   *
   * @param {Array.<number>} array
   * @param {number} [offset]
   * @returns {Color}
   */
  fromArray(array, offset = 0) {
    this.r = array[offset]
    this.g = array[offset + 1]
    this.b = array[offset + 2]
    return this
  }

  /**
   *
   * @param {Array} [array]
   * @param {number} [offset]
   * @returns {*[]}
   */
  toArray(array = [], offset = 0) {
    array[offset] = this.r
    array[offset + 1] = this.g
    array[offset + 2] = this.b
    return array
  }

  /**
   *
   * @returns {number}
   */
  toJSON() {
    return this.getHex()
  }
}