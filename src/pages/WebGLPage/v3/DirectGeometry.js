
export default class DirectGeometry {
  constructor() {
    this.type = 'Geometry'

    /**
     *
     * @type {Vector3[]}
     */
    this.vertices = []

    /**
     *
     * @type {Vector3[]}
     */
    this.normals = []

    /**
     *
     * @type {Color[]}
     */
    this.colors = []

    /**
     *
     * @type {Face[]}
     */
    this.faces = []
  }
}