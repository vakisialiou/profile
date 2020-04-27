import { Mesh, SphereGeometry, MeshStandardMaterial, Object3D, BackSide } from 'three'
import Planet from './../Planet'
import Star from './../Star'

export default class SpaceBox extends Object3D {
  constructor(texture) {
    super()

    /**
     *
     * @type {SphereGeometry}
     */
    this.geometry = new SphereGeometry(900, 16, 16)

    /**
     *
     * @type {MeshStandardMaterial}
     */
    this.material = new MeshStandardMaterial({ map: texture, side: BackSide, depthWrite: false, roughness: 1, metalness: 0 })

    /**
     *
     * @type {Mesh}
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.add(this.mesh)

    /**
     *
     * @type {number}
     */
    this.renderOrder = -100000

    /**
     *
     * @type {Array.<(Planet|Star)>}
     */
    this.particles = []
  }


  /**
   *
   * @returns {Array.<Planet>}
   */
  get planets() {
    return this.particles.filter((particle) => particle instanceof Planet)
  }

  /**
   *
   * @returns {Array.<Star>}
   */
  get stars() {
    return this.particles.filter((particle) => particle instanceof Star)
  }

  /**
   *
   * @param {(Planet|Star)} particle
   * @returns {SpaceBox}
   */
  addParticle(particle) {
    this.particles.push(particle)
    this.add(particle)
    return this
  }

  /**
   *
   * @param {Vector3} v
   * @returns {SpaceBox}
   */
  setPosition(v) {
    this.position.copy(v)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {SpaceBox}
   */
  update(delta) {
    for (const particle of this.particles) {
      particle.update(delta)
    }
    return this
  }
}