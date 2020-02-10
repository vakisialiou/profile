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

    this.dyingEvent(() => {
      // create animation
      setInterval(() => this.dispatchDestroyEvent(), 3000)
    })
  }
}