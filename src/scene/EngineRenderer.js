import { WebGLRenderer, WebGLRendererParameters, Scene, Vector2, sRGBEncoding } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

class EngineRenderer extends WebGLRenderer {
  /**
   *
   * @param {Scene} scene
   * @param {Camera} camera
   * @param {WebGLRendererParameters} [parameters]
   */
  constructor(scene, camera, parameters) {
    super({
      alpha: true,
      antialias: true,
      gammaInput: true,
      gammaOutput: true,
      gammaFactor: 0.2,
      physicallyCorrectLights: true,
      outputEncoding: sRGBEncoding,
      ...parameters
    })

    /**
     *
     * @type {Scene}
     */
    this.scene = scene

    /**
     *
     * @type {Camera}
     */
    this.camera = camera

    /**
     *
     * @type {boolean}
     */
    this.outlineEnabled = false

    /**
     *
     * @type {EffectComposer}
     */
    this.composer = new EffectComposer(this)

    /**
     *
     * @type {RenderPass}
     */
    this.renderPass = new RenderPass(this.scene, this.camera)

    /**
     *
     * @type {{resize: Function|null}}
     */
    this.register = { resize: null }
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
   * @param {Boolean} [value] - Default is TRUE
   * @returns {EngineRenderer}
   */
  enableOutline(value = true) {
    this.outlineEnabled = value
    return this
  }

  /**
   *
   * @param {Array.<(Object3D|Mesh)>} objectsArray
   * @param {Color} visibleColor
   * @returns {OutlinePass}
   */
  createOutline(objectsArray, visibleColor) {
    const outlinePass = new OutlinePass(new Vector2(this.width, this.width), this.scene, this.camera, objectsArray)
    outlinePass.edgeStrength = 2.5
    outlinePass.edgeGlow = 0.7
    outlinePass.edgeThickness = 2.8
    outlinePass.visibleEdgeColor = visibleColor
    outlinePass.hiddenEdgeColor.set(0)
    this.composer.addPass(outlinePass)
    this.enableOutline(true)
    return outlinePass
  }

  /**
   *
   * @returns {EngineRenderer}
   */
  update() {
    if (this.outlineEnabled) {
      this.composer.render()
    } else {
      this.render(this.scene, this.camera)
    }
    return this
  }

  /**
   *
   * @returns {void}
   */
  resize() {
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)
  }

  /**
   *
   * @returns {EngineRenderer}
   */
  preset() {
    this.setPixelRatio(window.devicePixelRatio)
    this.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)
    this.composer.addPass(this.renderPass)
    return this
  }

  /**
   *
   * @returns {EngineRenderer}
   */
  registerEvents() {
    if (!this.register.resize) {
      this.register.resize = () => this.resize()
      window.addEventListener('resize', this.register.resize, false )
    }
    return this
  }

  /**
   *
   * @returns {EngineRenderer}
   */
  unregisterEvents() {
    if (this.register.resize) {
      window.removeEventListener('resize', this.register.resize, false)
      this.register.resize = null
    }
    return this
  }
}

export default EngineRenderer