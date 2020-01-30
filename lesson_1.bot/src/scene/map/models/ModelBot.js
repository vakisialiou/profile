import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsBot from './base/ModelOptionsBot'

export default class ModelBot extends Model {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
    super(team, new ModelOptionsBot().setHealth(200))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(10, 100, 6)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color })
  }
}