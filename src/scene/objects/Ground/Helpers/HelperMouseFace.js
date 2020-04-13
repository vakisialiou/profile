import { BufferGeometry, LineBasicMaterial, Line, Vector3 } from 'three'

export default class HelperMouseFace extends Line {
  /**
   *
   * @param {Ground} ground
   */
  constructor(ground) {
    super()

    /**
     *
     * @type {BoxBufferGeometry}
     */
    this.geometry = new BufferGeometry()
    this.geometry.setFromPoints([ new Vector3(), new Vector3() ])

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new LineBasicMaterial({ color: 0xFF00FF })
  }

  /**
   *
   * @param {Vector3} position - Line position
   * @param {Vector3} direction - Line direction
   * @param {number} [length]
   * @returns {HelperMouseFace}
   */
  update(position, direction, length) {
    this.position.copy(position)
    const positions = this.geometry.attributes.position
    const topPosition = direction.clone().multiplyScalar(length || 1)
    positions.setXYZ(1, topPosition.x, topPosition.y, topPosition.z)
    positions.needsUpdate = true
    return this
  }
}