import Base from './units/Base'
import Tower from './units/Tower'

export default class Team {
  constructor(name, color) {
    /**
     *
     * @type {string}
     */
    this.name = name

    /**
     *
     * @type {string}
     */
    this.color = color

    /**
     *
     * @type {Base|ModelBase|Model}
     */
    this.base = undefined

    /**
     *
     * @type {Array.<Tower|ModelTower|Model>}
     */
    this.towers = []

    /**
     *
     * @type {boolean}
     */
    this.defeat = false
  }

  /**
   *
   * @param {Array.<Object>} rawBases
   * @return {Team}
   */
  setBase(rawBases) {
    this.base = new Base(this, rawBases[this.name]['name']).setPosition(rawBases[this.name]['position'])
    return this
  }

  /**
   *
   * @param {Array.<Object>} rawTowers
   * @return {Team}
   */
  setTowers(rawTowers) {
    this.towers = rawTowers[this.name]
      .map((base) => new Tower(this, base.name).setPosition(base.position))
    return this
  }

  /**
   *
   * @param {Tower|ModelTower|Model} tower
   * @return {Team}
   */
  removeTower(tower) {
    const index = this.towers.indexOf(tower)
    if (index !== -1) {
      this.towers.splice(index, 1)
    }
    return this
  }

  /**
   *
   * @return {Team}
   */
  removeBase() {
    this.defeat = true
    return this
  }
}