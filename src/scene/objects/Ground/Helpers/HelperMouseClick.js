import { CylinderGeometry, MeshStandardMaterial, Mesh, Group, Vector3 } from 'three'

export default class HelperMouseClick extends Group {
  /**
   *
   * @param {Ground} ground
   */
  constructor(ground) {
    super()

    /**
     *
     * @type {CylinderGeometry}
     */
    const geometry = new CylinderGeometry(2, 2, 0.4)

    /**
     *
     * @type {MeshStandardMaterial}
     */
    const material = new MeshStandardMaterial({ color: 0x00FFFF })

    const mesh = new Mesh(geometry, material)
    mesh.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
    this.add(mesh)
  }

  /**
   *
   * @param {Vector3} mousePosition
   * @param {Vector3} [faceDirection] - Set this value to get correct direction of helper on click different objects.
   * @returns {HelperMouseClick}
   */
  update(mousePosition, faceDirection = new Vector3(0, 1, 0)) {
    this.position.copy(mousePosition)
    this.lookAt(faceDirection.multiplyScalar(10).add(mousePosition))
    return this
  }
}