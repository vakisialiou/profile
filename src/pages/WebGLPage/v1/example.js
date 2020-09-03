import * as v1 from './index'

export default class Example {
  constructor(canvas) {
    this.scene = new v1.Scene(canvas)
    this.clearIds = []
  }

  /**
   *
   * @returns {Example}
   */
  render() {
    this.scene.render()

    const rectangleVertices = [
      -150, -100,
      150, -100,
      -150,  100,
      150, -100,
      -150,  100,
      150,  100
    ]

    // Shape rectangle - 1
    const material1 = new v1.Material({ color: { r: 1.0, g: 0.0, b: 0.0, a: 1.0 } })
    const geometry1 = new v1.Geometry({ vertices: rectangleVertices })
    const mesh1 = new v1.Mesh(geometry1, material1)
    mesh1.position.x = 200
    mesh1.position.y = 150
    this.scene.add(mesh1)

    // Shape rectangle - 2
    const material2 = new v1.Material({ color: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 } })
    const geometry2 = new v1.Geometry({ vertices: rectangleVertices })
    const mesh2 = new v1.Mesh(geometry2, material2)
    mesh2.position.x = - 200
    mesh2.position.y = 150
    this.scene.add(mesh2)

    const triangleVertices = [
      -150, -100,
      150, -100,
      -150,  100,
    ]

    // Shape triangle - 3
    const material3 = new v1.Material({ color: { r: 0.0, g: 1.0, b: 0.0, a: 1.0 } })
    const geometry3 = new v1.Geometry({ vertices: triangleVertices })
    const mesh3 = new v1.Mesh(geometry3, material3)
    mesh3.position.x = -200
    mesh3.position.y = -150
    this.scene.add(mesh3)

    // Shape triangle - 4
    const material4 = new v1.Material({ color: { r: 1.0, g: 1.0, b: 0.0, a: 1.0 } })
    const geometry4 = new v1.Geometry({ vertices: triangleVertices })
    const mesh4 = new v1.Mesh(geometry4, material4)
    mesh4.position.x = 200
    mesh4.position.y = -150
    this.scene.add(mesh4)
    this.scene.update()
    return this
  }

  /**
   *
   * @returns {Example}
   */
  animation() {
    let scale = {min: 0.2, max: 1.8, direction: 1}
    const intervalId = setInterval(() => {
      for (const mesh of this.scene.children) {
        mesh.rotationAngle += 0.02

        if (scale.direction === -1) {
          mesh.scale.x -= 0.01
          mesh.scale.y -= 0.01
        }

        if (scale.direction === 1) {
          mesh.scale.x += 0.01
          mesh.scale.y += 0.01
        }
      }

      if (this.scene.children[0].scale.x < scale.min) {
        scale.direction = 1
      }

      if (this.scene.children[0].scale.x > scale.max) {
        scale.direction = -1
      }
      this.scene.update()
    }, 1000 / 60)

    this.clearIds.push(intervalId)
    return this
  }

  /**
   *
   * @returns {Example}
   */
  destroy() {
    for (const intervalId of this.clearIds) {
      clearInterval(intervalId)
    }
    this.scene.destroy()
    return this
  }
}