import Team from './Team'
import ModelRoad from './models/ModelRoad'

export default class Map {
  constructor() {
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
  }

  /**
   *
   * @param {string} teamName
   * @return {Team|null}
   */
  getTeam(teamName) {
    return this.teams.find((team) => team.name === teamName) || null
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
   * @param {Team} activeTeam
   * @returns {(ModelBase|ModelTower)[]}
   */
  getEnemyBuilds(activeTeam) {
    let builds = []
    for (const team of this.teams) {
      if (team.defeat) {
        continue
      }
      if (team.name === activeTeam.name) {
        continue
      }
      builds = builds.concat(team.towers)
      builds.push(team.base)
    }
    return builds
  }

  /**
   *
   * @param {Tower} tower
   * @return {Map}
   */
  removeTower(tower) {
    tower.team.removeTower(tower)
    return this
  }

  /**
   *
   * @param {Base} base
   * @return {Map}
   */
  removeBase(base) {
    base.team.removeBase()
    return this
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
      this.teams[i] = new Team(team.name, team.color)
        .setBase(rawMap.bases)
        .setTowers(rawMap.towers)
    }

    for (const road of rawMap.roads) {
      this.roads.push(new ModelRoad(road.name, road.points, road.color))
    }

    return this
  }
}