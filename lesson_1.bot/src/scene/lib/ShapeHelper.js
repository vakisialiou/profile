import { MeshBasicMaterial, Mesh, SphereGeometry } from 'three'

class ShapeHelper extends Mesh {
  constructor(options = {}) {
    super()

    this.material = new MeshBasicMaterial({ color: options.color || 0xFF0000 })
  }

  renderSphere(radius = 0.6) {
    this.geometry = new SphereGeometry(radius)
    return this
  }
}

export default ShapeHelper