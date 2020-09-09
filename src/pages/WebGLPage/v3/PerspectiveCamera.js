import { mat4 } from 'gl-matrix'
import { degToRad } from './../lib/math'
import Vector3 from './Vector3'

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

    this.position = new Vector3(0, 80, 200)
    this.rotation = new Vector3(0, 0, 0)
    this.target = new Vector3(0, 0, 0)
    this.up = new Vector3(0, 1, 0)

    this.viewProjectionMatrix = this.update()
  }

  update() {
    let projectionMatrix = mat4.create()
    projectionMatrix = mat4.perspective(projectionMatrix, degToRad(this.fov), this.aspect, this.near, this.far)

    let cameraMatrix = mat4.create()
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation.getX(), [1, 0, 0])
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation.getY(), [0, 1, 0])
    cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, this.rotation.getZ(), [0, 0, 1])
    cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, this.position.toArray())

    const cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]
    const viewMatrix = mat4.lookAt(cameraMatrix, cameraPosition, this.target.toArray(), this.up.toArray())

    let viewProjectionMatrix = mat4.create()
    viewProjectionMatrix = mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix)
    return viewProjectionMatrix
  }
}