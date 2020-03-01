import { BufferGeometry, BoxBufferGeometry } from 'three'
import { MeshBasicMaterial, PointsMaterial } from 'three'
import { Raycaster, Vector2, GridHelper } from 'three'
import { Group, Mesh, Points, Vector3 } from 'three'
import GroundOptions from './GroundOptions'
import BaseModelGround from './BaseModelGround'

export default class Ground extends Group {
  /**
   *
   * @param {(Object|GroundOptions)} options
   */
  constructor(options = {}) {
    super()

    /**
     *
     * @type {Vector3}
     */
    this.direction = new Vector3(1, 0, 0)

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
     * @type {(Mesh|BaseModelGround)}
     */
    this.ground = new BaseModelGround(this.options)

    const clickHelperGeometry = new BoxBufferGeometry(this.options.pointSize, this.options.pointSize, this.options.pointSize)
    const clickHelperMaterial = new MeshBasicMaterial({color: 0xFF0000, opacity: 0.5, transparent: true})
    this.clickHelperMesh = new Mesh(clickHelperGeometry, clickHelperMaterial)
    this.clickHelperType = Ground.CLICK_HELPER_EDGE
    this.needAddClickHelper = false

    /**
     *
     * @type {GridHelper}
     */
    this.gridHelper = new GridHelper(this.options.height, this.options.heightSegments)

    /**
     *
     * @type {PointsMaterial}
     */
    const vertexMaterial = new PointsMaterial({color: 0x0080ff, size: 1, alphaTest: 0.5})
    const vertexGeometry = new BufferGeometry().setFromPoints(this.ground.geometry.vertices)
    this.vertexHelper = new Points(vertexGeometry, vertexMaterial)
  }

  static CLICK_HELPER_STRICT = 1
  static CLICK_HELPER_EDGE = 2

  /**
   *
   * @param {Number} [type]
   * @returns {Ground}
   */
  setClickHelper(type) {
    if (type) {
      this.clickHelperType = type
    }
    this.needAddClickHelper = true
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
  setVertexHelper() {
    this.add(this.vertexHelper)
    return this
  }

  /**
   *
   * @returns {Ground}
   */
  removeClickHelper() {
    this.remove(this.clickHelperMesh)
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
  removeVertexHelper() {
    this.remove(this.vertexHelper)
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
   * @param {{ intersect: Object, click: Vector3, mouse: Vector2 }} params
   * @callback GroundMouseClickEvent
   */

  /**
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {GroundMouseClickEvent} [callback]
   * @returns {void}
   */
  mouseUpdate(event, camera, callback) {
    event.preventDefault()
    const top = this.mouseOffset.y
    const left = this.mouseOffset.x
    this.mouse.set(((event.clientX - left) / window.innerWidth) * 2 - 1, - ((event.clientY - top) / window.innerHeight) * 2 + 1)
    this.raycaster.setFromCamera(this.mouse, camera)
    const intersects = this.raycaster.intersectObjects([this.ground])
    if (intersects.length === 0) {
      return
    }

    switch (this.clickHelperType) {
      case Ground.CLICK_HELPER_STRICT:
        this._updateCellHelperPositionStrict(intersects[0], this.options.pointSize)
        break
      case Ground.CLICK_HELPER_EDGE:
        this._updateCellHelperPositionEdge(intersects[0], this.options.pointSize)
        break
    }

    if (this.needAddClickHelper) {
      this.needAddClickHelper = false
      this.add(this.clickHelperMesh)
    }

    if (callback) {
      callback({ intersect: intersects[0], mouse: this.mouse, click: this.clickHelperMesh.position })
    }
  }

  /**
   *
   * @param {Object} intersect
   * @param {(number|?)} [pointSize]
   * @returns {Ground}
   * @private
   */
  _updateCellHelperPositionStrict(intersect, pointSize = null) {
    pointSize = pointSize || this.options.pointSize
    this.clickHelperMesh.position.copy(intersect.point)
    this.clickHelperMesh.position.setY(intersect.point.y + (pointSize / 2))
    return this
  }

  /**
   *
   * @param {Object} intersect
   * @param {number|?} [pointSize]
   * @returns {Ground}
   * @private
   */
  _updateCellHelperPositionEdge(intersect, pointSize = null) {
    pointSize = pointSize || this.options.pointSize
    this.clickHelperMesh.position.copy(intersect.point).add(intersect.face.normal)
    this.clickHelperMesh.position.divideScalar(pointSize).floor().multiplyScalar(pointSize).addScalar(pointSize / 2)
    this.clickHelperMesh.position.setY(intersect.point.y + (pointSize / 2))
    return this
  }

  /**
   * @returns {Ground}
   */
  render() {
    this.add(this.ground)
    this.ground.rotateOnAxis(this.direction, - Math.PI / 2)
    this.vertexHelper.rotateOnWorldAxis(this.direction, Math.PI / 2)
    return this
  }
}