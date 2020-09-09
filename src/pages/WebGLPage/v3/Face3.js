import Vector3 from './Vector3'

export default class Face3 {
  constructor(a, b, c, vertexNormals, materialIndex = 0) {
    this.a = a
    this.b = b
    this.c = c
    this.normal = new Vector3()
    this.vertexNormals = vertexNormals
    this.materialIndex = materialIndex
  }
}