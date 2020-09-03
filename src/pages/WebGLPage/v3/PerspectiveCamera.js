import { mat4 } from 'gl-matrix'

function degToRad(d) {
  return d * Math.PI / 180
}

const fieldOfViewRadians = degToRad(55)
const cameraRotation = [degToRad(0), degToRad(0), degToRad(0)]
const cameraPosition = [0, 80, 200]
const cameraUp = [0, 1, 0]
const cameraTarget = [0, 0, 0] // Plane position

export default class PerspectiveCamera {
  /**
   *
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  constructor(fov, aspect, near, far) {
    this.fov = fov || 50
    this.near = near || 0.1
    this.far = far || 2000
    this.aspect = aspect || 1

    this.position = [0, 80, 200]
    this.rotation = [0, 0, 0]
    this.target = [0, 0, 0]
    this.up = [0, 1, 0]

    // this.projectionMatrix = mat4.create()
    //
    // // Compute the camera's matrix using look at.
    // this.cameraMatrix = mat4.create()
    //
    // // Make a view matrix from the camera matrix.
    // this.viewMatrix = mat4.create()
    //
    // this.viewProjectionMatrix = mat4.create()
    this.viewProjectionMatrix = this.update()
  }

  update() {
    let projectionMatrix = mat4.create()
    projectionMatrix = mat4.perspective(projectionMatrix, degToRad(this.fov), this.aspect, this.near, this.far)

    let cameraMatrix = mat4.create()
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation[0], [1, 0, 0])
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation[1], [0, 1, 0])
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation[2], [0, 0, 1])
    cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, this.position)

    const cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]
    const viewMatrix = mat4.lookAt(cameraMatrix, cameraPosition, this.target, this.up)

    let viewProjectionMatrix = mat4.create()
    viewProjectionMatrix = mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix)
    return viewProjectionMatrix
  }
}