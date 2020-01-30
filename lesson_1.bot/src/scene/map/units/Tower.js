import ModelTower from './../models/ModelTower'

export default class Tower extends ModelTower {
  /**
   *
   * @param {Team} team
   * @param {string} name
   */
  constructor(team, name) {
    super(team)

    /**
     *
     */
    this.name = name
  }
}