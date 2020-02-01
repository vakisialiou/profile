import {MeshBasicMaterial, Group, Mesh, PlaneGeometry, DoubleSide, Vector3} from 'three'
import ModelOptionsGround from './base/ModelOptionsGround'

export default class ModelGround extends Group {
  /**
   *
   */
  constructor() {
    super()

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3(1, 0, 0)

    /**
     *
     * @type {ModelOptionsGround}
     */
    this.options = new ModelOptionsGround()

    /**
     *
     * @type {PlaneGeometry}
     */
    this.groundGeometry = new PlaneGeometry(this.options.width, this.options.height, this.options.widthSegments, this.options.heightSegments)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.groundMaterial = new MeshBasicMaterial({ color: 0x666666, side: DoubleSide, opacity: 0.5, transparent: true })

    /**
     *
     * @type {Mesh}
     */
    this.ground = new Mesh(this.groundGeometry, this.groundMaterial)
  }

  /**
   * @returns {ModelGround}
   */
  preset() {
    this.ground.rotateOnAxis(this.direction, Math.PI / 2)
    this.add(this.ground)
    return this
  }
}