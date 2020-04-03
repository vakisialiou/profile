import { SPE } from '@scene/libs/SPE'
import { AdditiveBlending, Color, NormalBlending, Vector3 } from 'three'

export default class TowerEffect {
  constructor() {

    this.shotEffectSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new Vector3(10),
        radius: 1,
      },
      velocity: {
        value: new Vector3( 10 )
      },
      size: {
        value: [ 30, 0 ]
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
      position: {
        distribution: SPE.distributions.SPHERE
      },
      alive: true,
      maxAge: { value: 2 },
      duration: 1,
      velocity: {
        value: new Vector3( 14, 3, 10 ),
        distribution: SPE.distributions.SPHERE
      },
      acceleration: {
        value: new Vector3( 0, 4, 0 ),
        distribution: SPE.distributions.BOX
      },
      size: { value: 100 },
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
   * @returns {TowerEffect}
   */
  createShotEffect(texture) {
    if (this.groups.hasOwnProperty(TowerEffect.EFFECT_SHOT)) {
      throw new Error(`Effect '${TowerEffect.EFFECT_SHOT}' has already created in TowerEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      blending: AdditiveBlending,
      maxParticleCount: 2000
    })

    particleGroup.addPool(1, this.shotEffectSettings, false)
    this.groups[TowerEffect.EFFECT_SHOT] = particleGroup
    return this
  }

  /**
   *
   * @param {Texture} texture
   * @returns {TowerEffect}
   */
  createMistEffect(texture) {
    if (this.groups.hasOwnProperty(TowerEffect.EFFECT_MIST)) {
      throw new Error(`Effect '${TowerEffect.EFFECT_MIST}' has already created in TowerEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      depthTest: false,
      depthWrite: true,
      blending: NormalBlending,
      maxParticleCount: 2000
    })

    particleGroup.addPool(1, this.shockMistSettings, false)
    this.groups[TowerEffect.EFFECT_MIST] = particleGroup

    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {TowerEffect}
   */
  emmitShotEffect(position) {
    this._emmitEffect(TowerEffect.EFFECT_SHOT, position)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {TowerEffect}
   */
  emmitMistEffect(position) {
    this._emmitEffect(TowerEffect.EFFECT_MIST, position)
    return this
  }

  /**
   *
   * @returns {Mesh}
   */
  getShotMesh() {
    const particleGroup = this._getGroup(TowerEffect.EFFECT_SHOT)
    return particleGroup['mesh']
  }

  /**
   *
   * @returns {Mesh}
   */
  getMistMesh() {
    const particleGroup = this._getGroup(TowerEffect.EFFECT_MIST)
    return particleGroup['mesh']
  }

  /**
   *
   * @param {number} delta
   * @returns {TowerEffect}
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
   * @returns {TowerEffect}
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
      throw Error(`Unknown group ${type}. Before emmit effect you must create it. Look at TowerEffect._emmitEffect`)
    }
    return this.groups[type]
  }
}