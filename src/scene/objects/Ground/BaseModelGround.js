import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export default class BaseModelGround extends Mesh {
  constructor(options) {
    super()

    /**
     *
     * @type {PlaneGeometry}
     */
    this.geometry = new PlaneGeometry(options.width, options.height, options.widthSegments, options.heightSegments)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: options.color })
  }
}