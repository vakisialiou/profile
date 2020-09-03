
export default class Geometry {
  constructor(oprions = {}) {
    this.vertices = oprions.vertices || [
      100, 200,
      800, 200,
      100, 300,
      100, 300,
      800, 200,
      800, 300,
    ]
  }
}