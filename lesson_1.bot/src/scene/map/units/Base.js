import ModelBase from './../models/ModelBase'

export default class Base extends ModelBase {
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