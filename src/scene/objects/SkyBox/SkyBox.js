import { SphereBufferGeometry, Vector3 } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'

export default class SkyBox extends Sky {
  constructor(size = 10000) {
    super()

    /**
     *
     * @type {SphereBufferGeometry}
     */
    this.geometry = new SphereBufferGeometry(size, 32, 32)

    /**
     *
     * @type {Vector3}
     */
    this.sunPosition = new Vector3()
  }

  /**
   *
   * @param {number} distance
   * @param {number} inclination
   * @param {number} azimuth
   * @returns {SkyBox}
   */
  setSunPosition(distance, inclination, azimuth) {
    const theta = Math.PI * (inclination - 0.5)
    const phi = 2 * Math.PI * (azimuth - 0.5)
    this.sunPosition.x = distance * Math.cos(phi)
    this.sunPosition.y = distance * Math.sin(phi) * Math.sin(theta)
    this.sunPosition.z = distance * Math.sin(phi) * Math.cos(theta)
    this.material.uniforms['sunPosition'].value.copy(this.sunPosition)
    return this
  }

  /**
   *
   *
   * @param {number} [distance]
   * @param {number} [inclination]
   * @param {number} [azimuth]
   * @param {Object|{[turbidity]: number, [rayleigh]: number, [mieCoefficient]: number, [mieDirectionalG]: number, [luminance]: number}} [options]
   * @returns {SkyBox}
   */
  preset(distance = 4000, inclination = 0.42, azimuth = 0.3, options = {}) {
    this.material.uniforms['turbidity'].value = options.turbidity || 10
    this.material.uniforms['rayleigh'].value = options.rayleigh || 2
    this.material.uniforms['mieCoefficient'].value = options.mieCoefficient || 0.005
    this.material.uniforms['mieDirectionalG'].value = options.mieDirectionalG || 0.6
    this.material.uniforms['luminance'].value = options.luminance || 0.67
    this.setSunPosition(distance, inclination, azimuth)
    return this
  }
}