import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Raycaster,
  Vector2,
  BoxBufferGeometry,
  GridHelper
} from 'three'
import ModelGround from './../models/ModelGround'

export default class Ground extends ModelGround {
  constructor() {
    super()

    /**
     *
     * @type {Raycaster}
     */
    this.raycaster = new Raycaster()

    /**
     *
     * @type {Vector2}
     */
    this.mouse = new Vector2()

    /**
     *
     * @type {BoxBufferGeometry}
     */
    this.cellHelperGeometry = new BoxBufferGeometry(this.options.pointSize, this.options.pointSize, this.options.pointSize)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.cellHelperMaterial = new MeshBasicMaterial({color: 0xFF0000, opacity: 0.5, transparent: true})

    /**
     *
     * @type {Mesh}
     */
    this.cellHelperMesh = new Mesh(this.cellHelperGeometry, this.cellHelperMaterial)

    /**
     *
     * @type {GridHelper}
     */
    this.gridHelper = new GridHelper(this.options.height, this.options.heightSegments)

    /**
     *
     * @type {PointsMaterial}
     */
    this.gridPointsMaterial = new PointsMaterial({color: 0x0080ff, size: 1, alphaTest: 0.5})

    /**
     *
     * @type {BufferGeometry}
     */
    this.gridPointsGeometry = new BufferGeometry().setFromPoints(this.ground.geometry.vertices)

    /**
     *
     * @type {Points}
     */
    this.gridPointsHelper = new Points(this.gridPointsGeometry, this.gridPointsMaterial)
  }

  /**
   *
   * @returns {Ground}
   */
  setCellHelper() {
    this.add(this.cellHelperMesh)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  setGridHelper() {
    this.add(this.gridHelper)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  setGridPointsHelper() {
    this.add(this.gridPointsHelper)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  removeCellHelper() {
    this.remove(this.cellHelperMesh)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  removeGridHelper() {
    this.remove(this.gridHelper)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  removeGridPointsHelper() {
    this.remove(this.gridPointsHelper)
    return this
  }

  /**
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @returns {void}
   */
  onDocumentMouseDown(event, camera) {
    event.preventDefault()
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
    this.raycaster.setFromCamera(this.mouse, camera)
    const intersects = this.raycaster.intersectObjects([this.ground])
    if (intersects.length > 0) {
      const intersect = intersects[0]
      const pointSize = this.options.pointSize
      this.cellHelperMesh.position.copy(intersect.point).add(intersect.face.normal)
      this.cellHelperMesh.position.divideScalar(pointSize).floor().multiplyScalar(pointSize).addScalar(pointSize / 2)
      this.cellHelperMesh.position.setY(pointSize / 2)
    }
  }

  /**
   * @returns {Ground}
   */
  preset() {
    super.preset()
    this.gridPointsHelper.rotateOnWorldAxis(this.direction, Math.PI / 2)
    return this
  }
}