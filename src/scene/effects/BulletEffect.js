import { SPE } from '@scene/libs/SPE'
import { NormalBlending, Color, Vector3 } from 'three'

export default class BulletEffect {
  constructor() {

    this.shockWaveEffectSettings = {
      particleCount: 10,
      type: SPE.distributions.SPHERE,
      position: {
        radius: 0.1,
      },
      maxAge: {
        value: 2
      },
      alive: true,
      activeMultiplier: 10,

      velocity: {
        value: new Vector3( 5 )
      },
      acceleration: {
        value: new Vector3( 0, -4, 0 ),
        distribution: SPE.distributions.BOX
      },
      size: { value: 14 },
      drag: {
        value: 1
      },
      color: {
        value: [
          new Color( 1, 1, 1 ),
          new Color( 1, 1, 0 ),
          new Color( 1, 0, 0 ),
          new Color( 0.4, 0.2, 0.1 )
        ]
      },
      opacity: { value: [0.4, 0] }
    }

    this.shockMistSettings = {
      particleCount: 1,
      position: {
        distribution: SPE.distributions.SPHERE
      },
      alive: true,
      maxAge: { value: 1 },
      duration: 1,
      velocity: {
        value: new Vector3( 14, 3, 10 ),
        distribution: SPE.distributions.SPHERE
      },
      acceleration: {
        value: new Vector3( 0, 24, 0 ),
        distribution: SPE.distributions.BOX
      },
      size: { value: 100 },
      color: {
        value: [
          new Color( 0.9, 0.9, 0.9 )
        ],
      },
      opacity: { value: [0, 0.2, 0.1, 0] }
    }

    this.groups = {}
  }

  static EFFECT_SHOCK_WAVE = 'EFFECT_SHOCK_WAVE'
  static EFFECT_MIST = 'EFFECT_MIST'

  /**
   *
   * @param {Texture} texture
   * @returns {BulletEffect}
   */
  createShockWaveEffect(texture) {
    if (this.groups.hasOwnProperty(BulletEffect.EFFECT_SHOCK_WAVE)) {
      throw new Error(`Effect '${BulletEffect.EFFECT_SHOCK_WAVE}' has already created in BulletEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      depthTest: false,
      depthWrite: true,
      blending: NormalBlending,
      maxParticleCount: 2000
    })

    particleGroup.addPool(1, this.shockWaveEffectSettings, false)
    this.groups[BulletEffect.EFFECT_SHOCK_WAVE] = particleGroup
    return this
  }

  /**
   *
   * @param {Texture} texture
   * @returns {BulletEffect}
   */
  createMistEffect(texture) {
    if (this.groups.hasOwnProperty(BulletEffect.EFFECT_MIST)) {
      throw new Error(`Effect '${BulletEffect.EFFECT_MIST}' has already created in BulletEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      depthTest: false,
      depthWrite: true,
      blending: NormalBlending,
      maxParticleCount: 2000
    })

    particleGroup.addPool(1, this.shockMistSettings, false)
    this.groups[BulletEffect.EFFECT_MIST] = particleGroup

    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {BulletEffect}
   */
  emmitShockWaveEffect(position) {
    this._emmitEffect(BulletEffect.EFFECT_SHOCK_WAVE, position)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {BulletEffect}
   */
  emmitMistEffect(position) {
    this._emmitEffect(BulletEffect.EFFECT_MIST, position)
    return this
  }

  /**
   *
   * @returns {Mesh}
   */
  getShockWaveMesh() {
    const particleGroup = this._getGroup(BulletEffect.EFFECT_SHOCK_WAVE)
    return particleGroup['mesh']
  }

  /**
   *
   * @returns {Mesh}
   */
  getMistMesh() {
    const particleGroup = this._getGroup(BulletEffect.EFFECT_MIST)
    return particleGroup['mesh']
  }

  /**
   *
   * @param {number} delta
   * @returns {BulletEffect}
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
   * @returns {BulletEffect}
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
      throw Error(`Unknown group ${type}. Before emmit effect you must create it. Look at BulletEffect._emmitEffect`)
    }
    return this.groups[type]
  }
}