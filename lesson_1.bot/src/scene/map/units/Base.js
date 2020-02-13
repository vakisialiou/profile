import ModelBase from './../models/ModelBase'

export default class Base extends ModelBase {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   * @param {string} name
   */
  constructor(team, gltf, name) {
    super(team, gltf)

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