import { WebGLRenderer, WebGLRendererParameters, Scene, Vector2, Color, sRGBEncoding } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

class EngineRenderer extends WebGLRenderer {
  /**
   *
   * @param {Scene} scene
   * @param {Camera} camera
   * @param {WebGLRendererParameters} [parameters]
   */
  constructor(scene, camera, parameters = {}) {
    super({ alpha: false, antialias: true, ...parameters })
    this.outputEncoding = sRGBEncoding
    this.physicallyCorrectLights = true

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
     * @type {SSAARenderPass}
     */
    this.ssaaRenderPass = new SSAARenderPass(this.scene, this.camera)

    /**
     *
     * @type {ShaderPass}
     */
    this.copyPass = new ShaderPass(CopyShader)

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
   * @returns {Vector2}
   */
  get resolution() {
    const pixelRatio = this.getPixelRatio()
    return new Vector2()
      .setX(1 / (this.width * pixelRatio))
      .setY(1 / (this.height * pixelRatio))
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
   * @param {{visibleEdgeColor: [(number|string|Color)], hiddenEdgeColor: [(number|string|Color)], edgeStrength: number, edgeGlow: number, edgeThickness: number, pulsePeriod: number}} [options]
   * @returns {OutlinePass}
   */
  createOutline(objectsArray, options = {}) {
    const outlinePass = new OutlinePass(new Vector2(this.width, this.width), this.scene, this.camera, objectsArray)
    outlinePass.edgeStrength = options.edgeStrength || 2.5
    outlinePass.edgeGlow = options.edgeGlow || 0.7
    outlinePass.edgeThickness = options.edgeThickness || 2.8
    outlinePass.pulsePeriod = options.pulsePeriod || 0
    if (options.visibleEdgeColor) {
      outlinePass.visibleEdgeColor.set(options.visibleEdgeColor)
    }
    if (options.hiddenEdgeColor) {
      outlinePass.hiddenEdgeColor.set(options.hiddenEdgeColor)
    }
    this.composer.addPass(outlinePass)
    return outlinePass
  }

  /**
   *
   * @param {OutlinePass} outlinePass
   * @returns {EngineRenderer}
   */
  removeOutline(outlinePass) {
    const index = this.composer.passes.indexOf(outlinePass)
    if (index > -1) {
      console.log(index, this.composer.passes)
      this.composer.passes.splice(index, 1)
    }
    return this
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
    this.setPixelRatio(window.devicePixelRatio || 1)
    this.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.copyPass)

    this.ssaaRenderPass.unbiased = true
    this.ssaaRenderPass.sampleLevel = 1
    this.composer.addPass(this.ssaaRenderPass)
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