import { Mesh, MeshBasicMaterial, PlaneGeometry, FaceColors } from 'three'

export default class Cover extends Mesh {
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
    this.material = new MeshBasicMaterial({ color: options.color, transparent: true, opacity: 0.8, vertexColors: FaceColors })
  }
}