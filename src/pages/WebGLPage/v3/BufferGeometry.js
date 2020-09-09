
export default class BufferGeometry {
  constructor() {
    this.type = 'BufferGeometry'
    this.attributes = {}
    this.groups = []
  }

  /**
   *
   * @param {string} name
   * @return {*}
   */
  getAttribute(name) {
    return this.attributes[name] || null
  }

  /**
   *
   * @param {string} name
   * @param {*} attribute
   * @return {BufferGeometry}
   */
  setAttribute(name, attribute) {
    this.attributes[name] = attribute
    return this
  }

  /**
   *
   * @param {Geometry} geometry
   * @returns {BufferGeometry}
   */
  fromGeometry(geometry) {
    let uv = []
    let colors = []
    let normals = []
    let vertices = []
    let group = { start: 0, count: 0, materialIndex: 0 }

    for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i]
      vertices = vertices.concat(geometry.vertices[face.a].toArray())
      vertices = vertices.concat(geometry.vertices[face.b].toArray())
      vertices = vertices.concat(geometry.vertices[face.c].toArray())

      normals = normals.concat(face.vertexNormals[0].toArray())
      normals = normals.concat(face.vertexNormals[1].toArray())
      normals = normals.concat(face.vertexNormals[2].toArray())

      uv = uv.concat(geometry.faceVertexUvs[i][0].toArray())
      uv = uv.concat(geometry.faceVertexUvs[i][1].toArray())
      uv = uv.concat(geometry.faceVertexUvs[i][2].toArray())


      // {start: 0, count: 12, materialIndex: 0}
    }

    if (vertices.length > 0) {
      this.setAttribute('position', {vertices: new Float32Array(vertices), itemSize: 3})
    }
    if (normals.length > 0) {
      this.setAttribute('normal', {vertices: new Float32Array(normals), itemSize: 3})
    }
    if (colors.length > 0) {
      this.setAttribute('color', {vertices: new Uint8Array(colors), itemSize: 3})
    }
    if (uv.length > 0) {
      this.setAttribute('uv', {vertices: new Float32Array(uv), itemSize: 2})
    }
    return this
  }
}