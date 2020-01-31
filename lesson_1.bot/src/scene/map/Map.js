import Team from './Team'
import ModelRoad from './models/ModelRoad'

export default class Map {
  /**
   *
   * @param {Scene} scene
   */
  constructor(scene) {

    /**
     *
     * @type {Scene}
     */
    this.scene = scene

    /**
     *
     * @type {string|undefined}
     */
    this.type = undefined

    /**
     *
     * @type {string|undefined}
     */
    this.name = undefined

    /**
     *
     * @type {string|undefined}
     */
    this.planeSize = undefined

    /**
     *
     * @type {string|undefined}
     */
    this.pointSize = undefined

    /**
     *
     * @type {Array.<Team>}
     */
    this.teams = []

    /**
     *
     * @type {Array.<ModelRoad>}
     */
    this.roads = []

    /**
     *
     * @type {Object}
     */
    this.cache = {}
  }

  /**
   *
   * @returns {Array.<Bot|ModelBot|Model>}}
   */
  get bots() {
    let bots = []
    for (const team of this.getTeams()) {
      bots = bots.concat(team.bots)
    }
    return bots
  }

  /**
   *
   * @returns {Array.<Charge|ModelCharge|Model>}
   */
  get charges() {
    let charges = []
    for (const team of this.getTeams()) {
      charges = charges.concat(team.charges)
    }
    return charges
  }

  /**
   *
   * @param {(Bot|ModelBot|Model)} bot
   * @returns {Map}
   */
  addBot(bot) {
    this.getTeam(bot.team.name).addBot(bot)
    return this
  }

  /**
   *
   * @param {(Tower|ModelTower|Model)} tower
   * @returns {Map}
   */
  addTower(tower) {
    this.getTeam(tower.team.name).addTower(tower)
    return this
  }

  /**
   *
   * @param {(Charge|ModelCharge|Model)} charge
   * @returns {Map}
   */
  addCharge(charge) {
    this.getTeam(charge.bot.team.name).addCharge(charge)
    return this
  }

  /**
   *
   * @param {(Bot|ModelBot|Model)} bot
   * @returns {Map}
   */
  removeBot(bot) {
    this.getTeam(bot.team.name).removeBot(bot)
    return this
  }

  /**
   *
   * @param {(Tower|ModelTower|Model)} tower
   * @returns {Map}
   */
  removeTower(tower) {
    this.getTeam(tower.team.name).removeTower(tower)
    return this
  }

  /**
   *
   * @param {(Charge|ModelCharge|Model)} charge
   * @returns {Map}
   */
  removeCharge(charge) {
    this.getTeam(charge.bot.team.name).removeCharge(charge)
    return this
  }

  /**
   *
   * @param {(Base|ModelBase|Model)} base
   * @returns {Map}
   */
  removeBase(base) {
    this.getTeam(base.team.name).removeBase(base)
    return this
  }

  /**
   *
   * @param {string} teamName
   * @return {Team}
   */
  getTeam(teamName) {
    if (!this.cache.hasOwnProperty(teamName)) {
      this.cache[teamName] = this.teams.find((team) => team.name === teamName)
    }
    return this.cache[teamName]
  }

  /**
   *
   * @param {string} teamName
   * @return {Array.<ModelTower>}
   */
  getTeamTowers(teamName) {
    const team = this.getTeam(teamName)
    return team ? team.towers : []
  }

  /**
   *
   * @param {string} teamName
   * @return {Array.<ModelBase>}
   */
  getTeamBase(teamName) {
    const team = this.getTeam(teamName)
    return team ? team.base : []
  }

  /**
   *
   * @returns {Array.<Team>}
   */
  getTeams() {
    return this.teams.filter((team) => !team.defeat)
  }

  /**
   *
   * @param {Team} activeTeam
   * @returns {Team[]}
   */
  getEnemyTeams(activeTeam) {
    return this.teams.filter((team) => (!team.defeat && team.name !== activeTeam.name))
  }

  /**
   *
   * @param {Team} activeTeam
   * @returns {(ModelBase|ModelTower)[]}
   */
  getEnemyUnits(activeTeam) {
    let units = []
    for (const team of this.getEnemyTeams(activeTeam)) {
      units = units.concat(team.bots, team.towers, team.bases)
    }
    return units
  }

  /**
   *
   * @param {Object} rawMap
   * @returns {Map}
   */
  preset(rawMap) {
    this.type = rawMap.type
    this.name = rawMap.name
    this.planeSize = rawMap.planeSize
    this.pointSize = rawMap.pointSize

    for (let i = 0; i < rawMap.teams.length; i++) {
      const team = rawMap.teams[i]
      this.teams[i] = new Team(this.scene, team.name, team.color)
        .setBase(rawMap.bases)
        .setTowers(rawMap.towers)
    }

    for (const rawRoad of rawMap.roads) {
      const road = new ModelRoad(rawRoad.name, rawRoad.points, rawRoad.color)
      this.roads.push(road)
      this.scene.add(road)
    }

    return this
  }
}