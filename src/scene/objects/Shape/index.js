import {
  Mesh,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  MeshPhongMaterial,
  RingGeometry,
  SphereGeometry,
} from 'three'

export default class Shape extends Mesh {
  /**
   *
   * @param {number} color
   */
  constructor(color) {
    super()

    this.material = new MeshPhongMaterial({ color })
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Shape}
   */
  setPosition(position) {
    this.position.copy(position)
    return this
  }

  /**
   *
   * @param {number} [radiusTop]
   * @param {number} [radiusBottom]
   * @param {number} [height]
   * @param {number} [segments]
   * @returns {Shape}
   */
  createCylinder(radiusTop = 10, radiusBottom = 10, height = 40, segments = 32) {
    this.geometry = new CylinderGeometry(radiusTop, radiusBottom, height, segments)
    return this
  }

  /**
   *
   * @param {number} [radius]
   * @param {number} [segments]
   * @returns {Shape}
   */
  createSphere(radius = 10, segments = 32) {
    this.geometry = new SphereGeometry(radius, segments, segments)
    return this
  }

  /**
   *
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} [depth]
   * @returns {Shape}
   */
  createBox(width = 10, height = 10, depth = 10) {
    this.geometry = new BoxGeometry(width, height, depth)
    return this
  }


  /**
   *
   * @param {number} [radius]
   * @param {number} [height]
   * @param {number} [segments]
   * @returns {Shape}
   */
  createCone(radius = 10, height = 40, segments = 32) {
    this.geometry = new ConeGeometry(radius, height, segments)
    return this
  }

  /**
   *
   * @param {number} [innerRadius]
   * @param {number} [outerRadius]
   * @param {number} [segments]
   * @returns {Shape}
   */
  createRing(innerRadius = 10, outerRadius = 15, segments = 32) {
    this.geometry = new RingGeometry(innerRadius, outerRadius, segments)
    return this
  }
}