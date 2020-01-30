import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsTower from './base/ModelOptionsTower'

export default class ModelTower extends Model {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
    super(team, new ModelOptionsTower().setHealth(300))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(10, 30, 10)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color })
  }
}