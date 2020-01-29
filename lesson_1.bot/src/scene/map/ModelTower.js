import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'

export default class ModelTower extends Mesh {
  /**
   *
   * @param {Team} team
   * @param {string} name
   * @param {Vector3|Object} position
   */
  constructor(team, name, position) {
    super()

    /**
     *
     * @type {Team}
     */
    this.team = team

    /**
     *
     * @type {string}
     */
    this.name = name

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
    this.position.copy(position)
  }
}