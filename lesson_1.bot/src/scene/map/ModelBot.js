import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

export default class ModelBot extends Mesh {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
    super()

    /**
     *
     * @type {Team}
     */
    this.team = team

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