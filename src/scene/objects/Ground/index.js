import { BufferGeometry, BoxBufferGeometry, PlaneGeometry } from 'three'
import { MeshBasicMaterial, PointsMaterial } from 'three'
import { Raycaster, Vector2, GridHelper } from 'three'
import { Group, Mesh, Points, Vector3 } from 'three'
import { RepeatWrapping } from 'three'
import GroundOptions from './GroundOptions'

export default class Ground extends Group {
  /**
   *
   * @param {(Object|GroundOptions)} options
   */
  constructor(options = {}) {
    super()

    /**
     *
     * @type {Vector2}
     */
    this.mouse = new Vector2()

    /**
     *
     * @type {Vector2}
     */
    this.mouseOffset = new Vector2()

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
     * @type {GroundOptions}
     */
    this.options = new GroundOptions().copy(options)

    /**
     *
     * @type {PlaneGeometry}
     */
    this.groundGeometry = new PlaneGeometry(this.options.width, this.options.height, this.options.widthSegments, this.options.heightSegments)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.groundMaterial = new MeshBasicMaterial()

    /**
     *
     * @type {Mesh}
     */
    this.ground = new Mesh(this.groundGeometry, this.groundMaterial)

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
   * @param {Texture} texture
   * @param {Vector2} [repeat]
   * @returns {Ground}
   */
  setTexture(texture, repeat) {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    if (repeat) {
      texture.repeat.copy(repeat)
    }
    this.groundMaterial.map = texture
    return this
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
   * Some pages can has f.g. top menu.
   * It that case need set mouse offset on height it menu to get correct mouse coordinates.
   *
   * @param {number} top
   * @param {number} left
   * @returns {Ground}
   */
  setMouseOffset(top, left) {
    this.mouseOffset.set(left, top)
    return this
  }

  /**
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @returns {void}
   */
  onMouseEvent(event, camera) {
    event.preventDefault()
    const top = this.mouseOffset.y
    const left = this.mouseOffset.x
    this.mouse.set(((event.clientX - left) / window.innerWidth) * 2 - 1, - ((event.clientY - top) / window.innerHeight) * 2 + 1)
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
  render() {
    this.add(this.ground)
    this.ground.rotateOnAxis(this.direction, - Math.PI / 2)
    this.gridPointsHelper.rotateOnWorldAxis(this.direction, Math.PI / 2)
    return this
  }
}