
class ModelOptionsGround {
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
  }
}

export default ModelOptionsGround