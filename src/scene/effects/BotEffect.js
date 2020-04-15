import { SPE } from '@scene/libs/SPE'
import { AdditiveBlending, MultiplyBlending, Color, NormalBlending, Vector3 } from 'three'

export default class BotEffect {
  constructor() {

    this.shotEffectSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new Vector3(0.4),
        radius: 1,
      },
      velocity: {
        value: new Vector3( 10 )
      },
      size: {
        value: [ 6, 0 ]
      },
      opacity: {
        value: [1, 0]
      },
      color: {
        value: [new Color('yellow'), new Color('red')]
      },
      particleCount: 10,
      alive: true,
      duration: 0.05,
      maxAge: {
        value: 0.5
      }
    }

    this.shockMistSettings = {
      particleCount: 1,
      // position: {
      //   distribution: SPE.distributions.SPHERE
      // },
      alive: true,
      maxAge: { value: 1 },
      duration: 1,
      velocity: {
        value: new Vector3( 14, 3, 10 ),
        distribution: SPE.distributions.SPHERE
      },
      acceleration: {
        value: new Vector3( 0, 10, 0 ),
        distribution: SPE.distributions.SPHERE
      },
      size: { value: 40 },
      color: {
        value: [
          new Color( 0.2, 0.2, 0.2 ),
          new Color( 0.6, 0.6, 0.6 ),
          new Color( 0.9, 0.9, 0.9 )
        ],
      },
      opacity: { value: [0.4, 0.2, 0.1, 0] }
    }

    this.groups = {}
  }

  static EFFECT_SHOT = 'EFFECT_SHOT'
  static EFFECT_MIST = 'EFFECT_MIST'

  /**
   *
   * @param {Texture} texture
   * @returns {BotEffect}
   */
  createShotEffect(texture) {
    if (this.groups.hasOwnProperty(BotEffect.EFFECT_SHOT)) {
      throw new Error(`Effect '${BotEffect.EFFECT_SHOT}' has already created in BotEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      blending: AdditiveBlending,
      maxParticleCount: 2000,
      // depthTest: false,
      // // alphaTest: false,
      // depthWrite: true,
    })

    particleGroup.addPool(10, this.shotEffectSettings, false)
    this.groups[BotEffect.EFFECT_SHOT] = particleGroup
    return this
  }

  /**
   *
   * @param {Texture} texture
   * @returns {BotEffect}
   */
  createMistEffect(texture) {
    if (this.groups.hasOwnProperty(BotEffect.EFFECT_MIST)) {
      throw new Error(`Effect '${BotEffect.EFFECT_MIST}' has already created in BotEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      // depthTest: false,
      // depthWrite: true,
      // depthTest: false,
      // depthWrite: true,
      blending: NormalBlending,
      maxParticleCount: 2000
    })

    particleGroup.addPool(10, this.shockMistSettings, false)
    this.groups[BotEffect.EFFECT_MIST] = particleGroup

    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {BotEffect}
   */
  emmitShotEffect(position) {
    this._emmitEffect(BotEffect.EFFECT_SHOT, position)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {BotEffect}
   */
  emmitMistEffect(position) {
    this._emmitEffect(BotEffect.EFFECT_MIST, position)
    return this
  }

  /**
   *
   * @returns {Mesh}
   */
  getShotMesh() {
    const particleGroup = this._getGroup(BotEffect.EFFECT_SHOT)
    particleGroup.mesh.frustumCulled = false
    return particleGroup['mesh']
  }

  /**
   *
   * @returns {Mesh}
   */
  getMistMesh() {
    const particleGroup = this._getGroup(BotEffect.EFFECT_MIST)
    particleGroup.mesh.frustumCulled = false
    return particleGroup['mesh']
  }

  /**
   *
   * @param {number} delta
   * @returns {BotEffect}
   */
  update(delta) {
    for (const groupName in this.groups) {
      if (!this.groups.hasOwnProperty(groupName)) {
        continue
      }
      const particleGroup = this.groups[groupName]
      particleGroup.tick(delta)
    }
    return this
  }

  /**
   *
   * @param {string} type
   * @param {Vector3} position
   * @returns {BotEffect}
   */
  _emmitEffect(type, position) {
    this._getGroup(type).triggerPoolEmitter(1, position)
    return this
  }

  /**
   *
   * @param {string} type
   * @returns {SPE.Group}
   * @private
   */
  _getGroup(type) {
    if (!this.groups.hasOwnProperty(type)) {
      throw Error(`Unknown group ${type}. Before emmit effect you must create it. Look at BotEffect._emmitEffect`)
    }
    return this.groups[type]
  }
}