import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'

export default class ModelBase extends Mesh {
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
     */
    this.name = name

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
    this.position.copy(position)
  }
}