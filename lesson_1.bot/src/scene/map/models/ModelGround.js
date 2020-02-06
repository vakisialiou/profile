import {MeshBasicMaterial, Group, Mesh, PlaneGeometry, DoubleSide, Vector3, TextureLoader, MirroredRepeatWrapping, RepeatWrapping} from 'three'
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

    this.texture = new TextureLoader().load('./textures/grass/1.jpg')
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
    this.texture.repeat.set(4, 4)

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
    this.groundMaterial = new MeshBasicMaterial({
      // color: 0x666666,
      // side: DoubleSide,
      // opacity: 0.1,
      // transparent: true,
      map: this.texture,
    })

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
    this.ground.rotateOnAxis(this.direction, - Math.PI / 2)
    this.add(this.ground)
    return this
  }
}