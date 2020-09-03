import { Vector3, Group, Euler } from 'three'

export default class MathObject {
  /**
   *
   * @param {(Node|Mesh|Group)} obj
   */
  constructor(obj) {

    /**
     *
     * @type {Node|Mesh|Group}
     * @private
     */
    this._obj = obj

    /**
     * Направление объекта по умолчанию. Расчет всех значение от этой точки.
     *
     * @type {Vector3}
     * @private
     */
    this._up = new Vector3(0, 0, -1)

    /**
     *
     * @type {Vector3}
     * @private
     */
    this.tmpPosition = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._tmpNextPosition = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._tmpDirection = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._tmpDirectionVectors = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._inversePoint = new Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._angleToPointXZ = new Vector3()

    /**
     *
     * @type {Euler}
     * @private
     */
    this._angleToPointXY = new Euler()
  }

  /**
   *
   * @returns {Vector3}
   */
  position() {
    return this._obj.getWorldPosition(this.tmpPosition)
  }

  /**
   *
   * @returns {Vector3}
   */
  direction() {
    return this._tmpDirection.copy(this._up).applyQuaternion(this._obj.quaternion)
  }

  /**
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Vector3}
   */
  directionVectors(a, b) {
    return this._tmpDirectionVectors.subVectors(a, b).normalize()
  }

  /**
   * Получить позицию точки в направлении объекта заданную длиной.
   *
   * @param {number} distance
   * @returns {Vector3}
   */
  nextPoint(distance) {
    const p = this.position()
    return this._tmpNextPosition.copy(this.direction()).multiplyScalar(distance).add(p)
  }

  /**
   * Получить противоположную позицию цели по осям XZ.
   *
   * @param {Vector3} target
   * @returns {Vector3}
   */
  inverseTargetXZ(target) {
    const p1 = this.position()
    return this._inversePoint.copy(target).sub(p1).multiplyScalar(-1).add(p1).setY(target.y)
  }

  /**
   *
   * @param {Vector3} point
   * @returns {number}
   */
  angleToPointXZ(point) {
    const p = this.position()
    const d = this.directionVectors(this._angleToPointXZ.copy(point).setY(p.y), p)
    let angle = this._up.angleTo(d)
    if (d.x - this._up.x > 0) {
      angle *= -1
    }
    return angle
  }

  /**
   *
   * @param {Vector3} point
   * @returns {number}
   */
  angleToPointXY(point) {
    const p = this.position()
    const direction = this.directionVectors(point, p)
    const rotation = this._angleToPointXY.setFromVector3(direction)
    return rotation.y
  }
}