import fetch from 'node-fetch'

import Face3 from './../Face3'
import Vector2 from './../Vector2'
import Vector3 from './../Vector3'
import Geometry from './../Geometry'
import Mesh from './../Mesh'

export default class OBJLoader {
  constructor() {
    this._mtlMaterials = []
  }

  /**
   *
   * @param {Array} materials
   * @returns {OBJLoader}
   */
  setMTLMaterials(materials) {
    this._mtlMaterials = materials
    return this
  }

  /**
   *
   * @param {string} file
   * @returns {Promise<Mesh>}
   */
  async load(file) {
    const str = await fetch(file)
      .then((res) => res.text())

    const mesh = new Mesh()
    const geometry = new Geometry()

    const materials = []
    const normals = []
    const uvs = []
    let materialIndex = -1

    const rows = str.split(/\n/)
    for (const row of rows) {
      const cells = row.split(/\s/)
      switch (cells[0]) {
        case '#':
          continue
        case 'o':
          mesh.setName(cells[1])
          break
        case 'v':
          geometry.addVertex(
            new Vector3()
              .setX(parseFloat(cells[1]))
              .setY(parseFloat(cells[2]))
              .setZ(parseFloat(cells[3]))
          )
          break
        case 'vn':
          normals.push([parseFloat(cells[1]), parseFloat(cells[2]), parseFloat(cells[3])])
          break
        case 'vt':
          uvs.push([parseFloat(cells[1]), parseFloat(cells[2])])
          break
        case 'usemtl':
          materialIndex++
          const material = this._mtlMaterials.find((material) => material.name === cells[1])
          if (material) {
            materials.push(material)
          }
          break
        case 'f':
          const map0 = cells[1].split(/\//)
          const map1 = cells[2].split(/\//)
          const map2 = cells[3].split(/\//)
          const map3 = cells[4].split(/\//)

          // Vertexes
          const af = parseInt(map0[0]) - 1
          const bf = parseInt(map1[0]) - 1
          const cf = parseInt(map2[0]) - 1
          const df = parseInt(map3[0]) - 1

          // Textures
          const at = parseInt(map0[1]) - 1
          const bt = parseInt(map1[1]) - 1
          const ct = parseInt(map2[1]) - 1
          const dt = parseInt(map3[1]) - 1

          // Normals
          const an = parseInt(map0[2]) - 1
          const bn = parseInt(map1[2]) - 1
          const cn = parseInt(map2[2]) - 1
          const dn = parseInt(map3[2]) - 1

          // Geometry start
          // 0, 1, 2
          geometry.addFace(new Face3(af, bf, cf, [
            new Vector3().fromArray(normals[an]),
            new Vector3().fromArray(normals[bn]),
            new Vector3().fromArray(normals[cn]),
          ], materialIndex))

          // 0, 2, 3
          geometry.addFace(new Face3(af, cf, df, [
            new Vector3().fromArray(normals[an]),
            new Vector3().fromArray(normals[cn]),
            new Vector3().fromArray(normals[dn]),
          ], materialIndex))

          // 0, 1, 2
          geometry.faceVertexUvs.push([
            new Vector2().fromArray(uvs[at]),
            new Vector2().fromArray(uvs[bt]),
            new Vector2().fromArray(uvs[ct]),
          ])

          // 0, 2, 3
          geometry.faceVertexUvs.push([
            new Vector2().fromArray(uvs[at]),
            new Vector2().fromArray(uvs[ct]),
            new Vector2().fromArray(uvs[dt]),
          ])
      }
    }

    if (materials.length > 0) {
      mesh.material = materials
    }

    geometry.computeFaceNormals()
    mesh.geometry.fromGeometry(geometry)
    return mesh
  }
}