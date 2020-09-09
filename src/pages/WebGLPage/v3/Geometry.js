import Vector3 from './Vector3'

export default class Geometry {
  constructor() {
    this.type = 'Geometry'

    /**
     *
     * @type {Vector3[]}
     */
    this.vertices = []

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

    /**
     *
     * @type {Array.<Array.<Vector2>>}
     */
    this.faceVertexUvs = []
  }

  /**
   *
   * @param {Vector3} vertex
   * @returns {Geometry}
   */
  addVertex(vertex) {
    this.vertices.push(vertex)
    return this
  }

  /**
   *
   * @param {Color} color
   * @returns {Geometry}
   */
  addColor(color) {
    this.colors.push(color)
    return this
  }

  /**
   *
   * @param {Face3} face
   * @returns {Geometry}
   */
  addFace(face) {
    this.faces.push(face)
    return this
  }

  /**
   *
   * V  = P2 - P1
   * W  = P3 - P1
   * Nx = (Vy ∗ Wz) − (Vz ∗ Wy)
   * Ny = (Vz ∗ Wx) − (Vx ∗ Wz)
   * Nz = (Vx ∗ Wy) − (Vy ∗ Wx)
   *
   * @returns {Geometry}
   */
  computeFaceNormals() {
    const ab = new Vector3()
    const cb = new Vector3()
    for (const face of this.faces) {
      const vA = this.vertices[face.a]
      const vB = this.vertices[face.b]
      const vC = this.vertices[face.c]
      ab.subVectors(vB, vA)
      cb.subVectors(vC, vA)
      face.normal.crossVectors(ab, cb).normalize()
    }
    return this
  }
}