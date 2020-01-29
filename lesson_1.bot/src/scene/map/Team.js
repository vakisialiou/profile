import ModelBase from './ModelBase'
import ModelTower from './ModelTower'

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
     * @type {ModelBase}
     */
    this.base = undefined

    /**
     *
     * @type {Array.<ModelTower>}
     */
    this.towers = []
  }

  /**
   *
   * @param {Array.<Object>} rawBases
   * @return {Team}
   */
  setBase(rawBases) {
    this.base = new ModelBase(this, rawBases[this.name]['name'], rawBases[this.name]['position'])
    return this
  }

  /**
   *
   * @param {Array.<Object>} rawTowers
   * @return {Team}
   */
  setTowers(rawTowers) {
    this.towers = rawTowers[this.name]
      .map((base) => new ModelTower(this, base.name, base.position))
    return this
  }
}