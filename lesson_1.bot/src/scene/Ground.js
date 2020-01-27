import {
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Vector3,
  Raycaster, Vector2, BoxBufferGeometry, GridHelper
} from 'three'

export default class Ground extends Group {
  constructor() {
    super()

    /**
     *
     * @type {number}
     */
    this.pointSize = 10

    /**
     *
     * @type {number}
     */
    this.planeSize = 1000

    /**
     *
     * @type {PlaneGeometry}
     */
    this.groundGeometry = new PlaneGeometry(this.planeSize, this.planeSize, this.planeSize / this.pointSize, this.planeSize / this.pointSize)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.groundMaterial = new MeshBasicMaterial({ color: 0x666666, side: DoubleSide, opacity: 0.5, transparent: true })

    /**
     *
     * @type {Mesh}
     */
    this.ground = new Mesh(this.groundGeometry, this.groundMaterial)

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3(1, 0, 0)

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
    this.cellHelperGeometry = new BoxBufferGeometry(this.pointSize, this.pointSize, this.pointSize)

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
    this.gridHelper = new GridHelper(this.planeSize, this.planeSize / this.pointSize)

    /**
     *
     * @type {PointsMaterial}
     */
    this.gridPointsMaterial = new PointsMaterial({color: 0x0080ff, size: 1, alphaTest: 0.5})

    /**
     *
     * @type {BufferGeometry}
     */
    this.gridPointsGeometry = new BufferGeometry().setFromPoints(this.groundGeometry.vertices)

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
      this.cellHelperMesh.position.copy(intersect.point).add(intersect.face.normal)
      this.cellHelperMesh.position.divideScalar(this.pointSize).floor().multiplyScalar(this.pointSize).addScalar(this.pointSize / 2)
      this.cellHelperMesh.position.setY(this.pointSize / 2)
    }
  }

  /**
   * @returns {void}
   */
  render() {
    this.ground.rotateOnAxis(this.direction, Math.PI / 2)
    this.gridPointsHelper.rotateOnAxis(this.direction, Math.PI / 2)
    this.add(this.ground)
  }
}