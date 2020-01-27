import { WebGLRenderer, WebGLRendererParameters, Scene, PerspectiveCamera } from 'three'

class EngineRenderer extends WebGLRenderer {
  /**
   *
   * @param {WebGLRendererParameters} [parameters]
   */
  constructor(parameters) {
    super({
      alpha: true,
      antialias: true,
      gammaInput: true,
      gammaOutput: true,
      ...parameters
    })

    /**
     *
     * @type {{active: boolean, resize: Function|null}}
     */
    this.eventListeners = { active: false, resize: null }
  }

  /**
   *
   * @returns {number}
   */
  get width() {
    return window.innerWidth
  }

  /**
   *
   * @returns {number}
   */
  get height() {
    return window.innerHeight
  }

  /**
   *
   * @param {Scene} scene
   * @param {PerspectiveCamera} camera
   * @returns {EngineRenderer}
   */
  update(scene, camera) {
    camera.aspect = this.width / this.height
    camera.updateProjectionMatrix()
    this.render(scene, camera)
    return this
  }

  /**
   *
   * @param {PerspectiveCamera} camera
   * @returns {void}
   */
  resize(camera) {
    camera.aspect = this.width / this.height
    camera.updateProjectionMatrix()
    this.setSize(this.width, this.height)
  }

  /**
   *
   * @param {PerspectiveCamera} camera
   * @returns {EngineRenderer}
   */
  start(camera) {
    this.setPixelRatio(window.devicePixelRatio)
    this.setSize(this.width, this.height)

    if (!this.eventListeners.active) {
      this.eventListeners.resize = () => this.resize(camera)
      window.addEventListener('resize', this.eventListeners.resize, false )
    }
    return this
  }

  /**
   *
   * @returns {EngineRenderer}
   */
  stop() {
    if (this.eventListeners.active) {
      this.eventListeners.resize = null
      window.removeEventListener('resize', this.eventListeners.resize, false )
    }
    return this
  }
}

export default EngineRenderer