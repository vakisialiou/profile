
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
  computeGroups(geometry) {
    let materialIndex;
    for (const face of geometry.faces) {
      const prevGroup = this.groups[this.groups.length - 1] || {}
      const prevStart = prevGroup.start || 0
      const prevCount = prevGroup.count || 0
      if (face.materialIndex !== materialIndex) {
        materialIndex = face.materialIndex
        this.groups.push({ start: prevStart + prevCount, count: 3, materialIndex: face.materialIndex })
      } else {
        prevGroup.count += 3
      }
    }
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

    this.computeGroups(geometry)
    return this
  }
}