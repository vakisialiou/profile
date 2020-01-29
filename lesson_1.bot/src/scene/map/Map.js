import Team from './Team'
import ModelRoad from './ModelRoad'
import ModelBase from './ModelBase'
import ModelTower from './ModelTower'

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