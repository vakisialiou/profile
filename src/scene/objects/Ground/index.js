import { Raycaster, Vector2 } from 'three'
import { Group, Mesh, Vector3, RepeatWrapping } from 'three'
import GroundOptions from './GroundOptions'
import Cover from './Cover'


export default class Ground extends Group {
  /**
   *
   * @param {(Object|GroundOptions)} options
   */
  constructor(options = {}) {
    super()

    /**
     *
     * @type {GroundOptions}
     */
    this.options = new GroundOptions().copy(options)

    /**
     *
     * @type {(Mesh|Ground)}
     */
    this.cover = new Cover(this.options)

    /**
     *
     * @type {Vector2}
     * @private
     */
    this._mouse = new Vector2()

    /**
     *
     * @type {Vector2}
     * @private
     */
    this._mouseOffset = new Vector2()

    /**
     *
     * @type {Raycaster}
     * @private
     */
    this._raycaster = new Raycaster()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._segmentPosition = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._facePosition = new Vector3()

    this.add(this.cover)
    this.cover.rotateOnAxis(new Vector3(1, 0, 0), - Math.PI / 2)
  }

  /**
   *
   * @param {Texture} texture
   * @param {number} [repeatX]
   * @param {number} [repeatY]
   * @returns {Ground}
   */
  setTexture(texture, repeatX = 4, repeatY = 4) {
    texture.repeat.set(repeatX, repeatY)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    this.cover.material.map = texture
    return this
  }

  /**
   * Some pages can has f.g. top menu.
   * It that case need set height mouse offset from this menu to get correct mouse coordinates.
   *
   * @param {number} top
   * @param {number} left
   * @returns {Ground}
   */
  setMouseOffset(top, left) {
    this._mouseOffset.set(left, top)
    return this
  }

  /**
   *
   * @param {Object} intersect
   * @returns {Vector3}
   */
  extractVertexPosition(intersect) {
    const vertices = intersect.object.geometry.vertices
    const pA = vertices[intersect.face.a].clone().add(intersect.object.position)
    const pB = vertices[intersect.face.b].clone().add(intersect.object.position)
    const pC = vertices[intersect.face.c].clone().add(intersect.object.position)

    if (intersect.object === this.cover) {
      pA.applyQuaternion(this.cover.quaternion)
      pB.applyQuaternion(this.cover.quaternion)
      pC.applyQuaternion(this.cover.quaternion)
    }

    const items = [
      { point: pA, distance: pA.distanceTo(intersect.point) },
      { point: pB, distance: pB.distanceTo(intersect.point) },
      { point: pC, distance: pC.distanceTo(intersect.point) },
    ]

    let nearestFace
    for (const item of items) {
      if (!nearestFace || item.distance < nearestFace.distance) {
        nearestFace = item
      }
    }

    return nearestFace.point
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {Array.<Object3D|Group>} [intersectionObjects]
   * @returns {Vector3|?}
   */
  getVertexPosition(event, camera, intersectionObjects = []) {
    const intersection = this.findIntersection(event, camera, intersectionObjects)
    if (!intersection) {
      return null
    }

    return this.extractVertexPosition(intersection)
  }

  /**
   *
   * @param {Object} intersect
   * @returns {Vector3}
   */
  extractFaceDirection(intersect) {
    const normal = intersect.face.normal.clone()
    normal.transformDirection(intersect.object.matrixWorld)
    return normal
  }

  /**
   *
   * @param {Object} intersect
   * @param {number} [distance]
   * @returns {Vector3|?}
   */
  extractFacePosition(intersect, distance = 1) {
    const vertices = intersect.object.geometry.vertices
    const v1 = vertices[intersect.face.a]
    const v2 = vertices[intersect.face.b]
    const v3 = vertices[intersect.face.c]

    this._facePosition.x = (v1.x + v2.x + v3.x) / 3
    this._facePosition.y = (v1.y + v2.y + v3.y) / 3
    this._facePosition.z = (v1.z + v2.z + v3.z) / 3
    if (intersect.object === this.cover) {
      this._facePosition.applyQuaternion(this.cover.quaternion)
    }
    const direction = this.extractFaceDirection(intersect)
    return direction.multiplyScalar(distance || 1).add(this._facePosition).add(intersect.object.position)
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {Array.<Object3D|Group>} [intersectionObjects]
   * @param {number} [distance]
   * @returns {Vector3|?}
   */
  getFacePosition(event, camera, intersectionObjects = [], distance = 1) {
    const intersection = this.findIntersection(event, camera, intersectionObjects)
    if (!intersection) {
      return null
    }

    return this.extractFacePosition(intersection)
  }

  /**
   *
   * @param {Object} intersect
   * @returns {Vector3}
   */
  extractSegmentPosition(intersect) {
    this._segmentPosition.copy(intersect.point).add(intersect.face.normal)
    this._segmentPosition.divideScalar(this.options.pointSize).floor().multiplyScalar(this.options.pointSize).addScalar(this.options.pointSize / 2)
    this._segmentPosition.setY(this.position.y)
    return this._segmentPosition
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @returns {Vector3|?}
   */
  getSegmentPosition(event, camera) {
    const intersection = this.findIntersection(event, camera)
    if (!intersection) {
      return null
    }
    return this.extractSegmentPosition(intersection)
  }

  /**
   *
   * @param {Object} intersect
   * @returns {Vector3}
   */
  extractMouse3DPosition(intersect) {
    return intersect.point
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {Array.<Object3D|Group>} [intersectionObjects]
   * @returns {Vector3|?}
   */
  getMouse3DPosition(event, camera, intersectionObjects = []) {
    const intersections = this.findIntersections(event, camera, intersectionObjects)
    if (intersections.length === 0) {
      return null
    }
    return intersections[0]['point']
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {Array.<Object3D|Group>} [intersectionObjects]
   * @param {boolean} [recursive]
   * @returns {Object|?}
   */
  findIntersection(event, camera, intersectionObjects = [], recursive = false) {
    const intersections = this.findIntersections(event, camera, intersectionObjects, recursive)
    if (intersections.length === 0) {
      return null
    }
    return intersections[0]
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {Camera} camera
   * @param {Array.<Object3D|Group>} [intersectionObjects]
   * @param {boolean} [recursive]
   * @returns {Array.<Object>}
   */
  findIntersections(event, camera, intersectionObjects = [], recursive = false) {
    const mouse = this.getMouse2DPosition(event, this._mouse, this._mouseOffset.y, this._mouseOffset.x)
    this._raycaster.setFromCamera(mouse, camera)
    return this._raycaster.intersectObjects([this.cover, ...intersectionObjects], recursive)
  }

  /**
   * @param {MouseEvent} event
   * @param {Vector2} mouse
   * @param {number} [offsetY]
   * @param {number} [offsetX]
   * @returns {Vector2}
   */
  getMouse2DPosition(event, mouse, offsetY = 0, offsetX = 0) {
    return mouse.set(((event.clientX - offsetX) / window.innerWidth) * 2 - 1, - ((event.clientY - offsetY) / window.innerHeight) * 2 + 1)
  }
}