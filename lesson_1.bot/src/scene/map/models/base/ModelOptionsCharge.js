import ModelOptions from './ModelOptions'

class ModelOptionsCharge extends ModelOptions {
  constructor() {
    super()

    /**
     *
     * @type {number}
     */
    this.distance = 0
  }

  /**
   *
   * @param {number} value
   * @return {ModelOptions}
   */
  setDistance(value) {
    this.distance = value
    return this
  }
}

export default ModelOptionsCharge