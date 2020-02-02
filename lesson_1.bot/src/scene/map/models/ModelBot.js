import { CylinderGeometry, MeshBasicMaterial } from 'three'
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
     * @type {CylinderGeometry}
     */
    this.geometry = new CylinderGeometry(10, 10, 10)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color })
  }
}