import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsBase from './base/ModelOptionsBase'

export default class ModelBase extends Model {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
    super(team, new ModelOptionsBase().setHealth(800))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(60, 10, 60)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color })
  }
}