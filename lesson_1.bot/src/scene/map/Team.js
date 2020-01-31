import Base from './units/Base'
import Tower from './units/Tower'

export default class Team {
  /**
   *
   * @param {Scene} scene
   * @param {string} name
   * @param {string} color
   */
  constructor(scene, name, color) {

    /**
     *
     * @type {Scene}
     */
    this.scene = scene

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
     * @type {Array.<Base|ModelBase|Model>}
     */
    this.bases = []

    /**
     *
     * @type {Array.<Tower|ModelTower|Model>}
     */
    this.towers = []

    /**
     *
     * @type {Array.<Bot|ModelBot|Model>}
     */
    this.bots = []

    /**
     *
     * @type {Array.<Charge|ModelCharge|Model>}
     */
    this.charges = []

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
    const rawBase = rawBases[this.name]
    const base = new Base(this, rawBase['name']).setPosition(rawBase['position'])
    this.bases.push(base)
    this.scene.add(base)
    return this
  }

  /**
   *
   * @param {Array.<Object>} rawTowers
   * @return {Team}
   */
  setTowers(rawTowers) {
    for (const item of rawTowers[this.name]) {
      const tower = new Tower(this, item.name).setPosition(item.position)
      this.towers.push(tower)
      this.scene.add(tower)
    }
    return this
  }

  /**
   *
   * @param {Charge|ModelCharge|Model} charge
   * @return {Team}
   */
  addCharge(charge) {
    if (!this.charges.includes(charge)) {
      this.charges.push(charge)
      this.scene.add(charge)
    }
    return this
  }

  /**
   *
   * @param {Tower|ModelTower|Model} tower
   * @return {Team}
   */
  addTower(tower) {
    if (!this.towers.includes(tower)) {
      this.scene.add(tower)
    }
    return this
  }

  /**
   *
   * @param {Bot|ModelBot|Model} bot
   * @return {Team}
   */
  addBot(bot) {
    if (!this.bots.includes(bot)) {
      this.bots.push(bot)
      this.scene.add(bot)
    }
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
      this.scene.remove(tower)
    }
    return this
  }

  /**
   *
   * @param {Charge|ModelCharge|Model} charge
   * @return {Team}
   */
  removeCharge(charge) {
    const index = this.charges.indexOf(charge)
    if (index !== -1) {
      this.charges.splice(index, 1)
      this.scene.remove(charge)
    }
    return this
  }

  /**
   *
   * @param {Bot|ModelBot|Model} bot
   * @return {Team}
   */
  removeBot(bot) {
    const index = this.bots.indexOf(bot)
    if (index !== -1) {
      this.bots.splice(index, 1)
      this.scene.remove(bot)
    }
    return this
  }

  /**
   *
   * @param {Base|ModelBase|Model} base
   * @return {Team}
   */
  removeBase(base) {
    const index = this.bases.indexOf(base)
    if (index !== -1) {
      this.bases.splice(index, 1)
      this.scene.remove(base)
    }
    if (this.bases.length === 0) {
      this.defeat = true
    }
    return this
  }
}