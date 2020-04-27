import { WebGLRenderer, WebGLRendererParameters, Scene, Vector2, Color, sRGBEncoding, LinearToneMapping } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

class EngineRenderer extends WebGLRenderer {
  /**
   *
   * @param {Scene} scene
   * @param {Camera} camera
   * @param {WebGLRendererParameters} [parameters]
   */
  constructor(scene, camera, parameters = {}) {
    super({ alpha: true, antialias: true, logarithmicDepthBuffer: true, ...parameters })

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
     * @type {ShaderPass}
     */
    this.fxaaPass = new ShaderPass(FXAAShader)

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
   * @param {{visibleEdgeColor: [(number|string|Color)], hiddenEdgeColor: [(number|string|Color)], edgeStrength: number, edgeGlow: number, edgeThickness: number, pulsePeriod: number}} [options]
   * @returns {OutlinePass}
   */
  createOutline(options = {}) {
    const outlinePass = new OutlinePass(new Vector2(this.width, this.height), this.scene, this.camera)
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

    /**
     *
     * @param {(Array.<Mesh>|Array.<SkinnedMesh>)} meshes
     * @param {boolean} isSkinnedMeshes
     */
    outlinePass.setMeshes = (meshes, isSkinnedMeshes) => {
      outlinePass.depthMaterial.skinning = isSkinnedMeshes
      outlinePass.prepareMaskMaterial.skinning = isSkinnedMeshes
      outlinePass.depthMaterial.morphTargets = !isSkinnedMeshes
      outlinePass.prepareMaskMaterial.morphTargets = !isSkinnedMeshes
      outlinePass.depthMaterial.needsUpdate = true
      outlinePass.prepareMaskMaterial.needsUpdate = true
      outlinePass.selectedObjects = meshes
      return outlinePass
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
    this.composer.addPass(this.renderPass)
    this.setPixelRatio(window.devicePixelRatio || 1)
    this.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)

    this.fxaaPass.uniforms['resolution'].value.copy(this.resolution)
    this.fxaaPass.renderToScreen = true
    this.composer.addPass(this.fxaaPass)
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