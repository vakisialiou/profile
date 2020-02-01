
class ModelOptions {
  constructor() {


    /**
     *
     * @type {number}
     */
    this.health = 0

    /**
     *
     * @type {number}
     */
    this.speed = 0

    /**
     *
     * @type {number}
     */
    this.damage = 0
  }

  /**
   *
   * @param {number} value
   * @return {ModelOptions}
   */
  setHealth(value) {
    this.health = value
    return this
  }

  /**
   *
   * @param {number} value
   * @return {ModelOptions}
   */
  setSpeed(value) {
    this.speed = value
    return this
  }

  /**
   *
   * @param {number} value
   * @return {ModelOptions}
   */
  setDamage(value) {
    this.damage = value
    return this
  }
}

export default ModelOptions