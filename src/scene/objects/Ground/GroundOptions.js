
class GroundOptions {
  constructor() {
    /**
     *
     * @type {string}
     */
    this.type = this.constructor.name

    /**
     *
     * @type {number}
     */
    this.pointSize = 10

    /**
     *
     * @type {number}
     */
    this.width = 1000

    /**
     *
     * @type {number}
     */
    this.height = 1000

    /**
     *
     * @type {number}
     */
    this.widthSegments = this.width / this.pointSize

    /**
     *
     * @type {number}
     */
    this.heightSegments = this.height / this.pointSize

    /**
     *
     * @type {number}
     */
    this.color = 0xC4D8B7
  }

  /**
   *
   * @param {(Object|GroundOptions)} options
   * @returns {GroundOptions}
   */
  copy(options) {
    for (const property in options) {
      if (!options.hasOwnProperty(property)) {
        continue
      }
      if (!this.hasOwnProperty(property)) {
        console.warn(`Property '${property}' does not exists in GroundOptions`)
        continue
      }
      this[property] = options[property]
    }
    return this
  }
}

export default GroundOptions