import { Group, Mesh, CylinderGeometry, MeshBasicMaterial, SkinnedMesh } from 'three'
import UnitAnimation from './../animations/UnitAnimation'

export default class Unit extends Group {
  constructor(rawModel) {
    super()

    /**
     * @type {Mesh|Group}
     */
    this.model = rawModel.model

    if (this.model.hasOwnProperty('material') && this.model.material.hasOwnProperty('metalness')) {
      this.model.material.metalness = 0
    }

    this.add(this.model)

    /**
     *
     * @type {UnitAnimation}
     */
    this.animation = new UnitAnimation(rawModel)

    const geometry = new CylinderGeometry(20, 20, 60, 16, 16)
    const material = new MeshBasicMaterial({ color: 0x666666, transparent: true, opacity: 0 })
    this.unitBody = new Mesh(geometry, material)
    this.unitBody.renderOrder = 10000
    this.unitBody.visible = false
    this.add(this.unitBody)
  }

  /**
   *
   * @returns {Array.<SkinnedMesh>}
   */
  getSkinnedMeshes() {
    const meshes = []
    this.model.traverse((item) => {
      if (item instanceof SkinnedMesh) {
        meshes.push(item)
      }
    })
    return meshes
  }

  /**
   *
   * @param position
   * @returns {Unit}
   */
  setPosition(position) {
    this.position.copy(position)
    return this
  }

  /**
   *
   * @param {Mesh} unitBody
   * @returns {Unit}
   */
  setUnitBody(unitBody) {
    // TODO: need realize
    return this
  }

  /**
   *
   * @param {string} name
   * @returns {Node|undefined}
   */
  getObjectByName(name) {
    return this.model.getObjectByName(name) || super.getObjectByName(name)
  }

  /**
   *
   * @param {number} size
   * @returns {Unit}
   */
  setScale(size) {
    this.model.scale.set(size, size, size)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Unit}
   */
  update(delta) {
    this.animation.update(delta)
    return this
  }
}