import { SPE } from '@scene/libs/SPE'
import { NormalBlending, Color, Vector3 } from 'three'

export default class BulletEffect {
  constructor() {

    this.shockWaveEffectSettings = {
      particleCount: 20,
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
        value: new Vector3( 10 )
      },
      acceleration: {
        value: new Vector3( 0, -2, 0 ),
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
      particleCount: 10,
      position: {
        // spread: new Vector3( 10, 10, 10 ),
        distribution: SPE.distributions.SPHERE
      },
      alive: true,
      maxAge: { value: 2 },
      duration: 1,
      // activeMultiplier: 2000,
      velocity: {
        value: new Vector3( 8, 3, 10 ),
        distribution: SPE.distributions.SPHERE
      },
      size: { value: 40 },
      color: {
        value: new Color( 0.2, 0.2, 0.2 )
      },
      opacity: { value: [0, 0, 0.2, 0] }
    }

    this.groups = {}
  }

  static EFFECT_SHOCK_WAVE = 'EFFECT_SHOCK_WAVE'

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
    particleGroup.addPool(20, this.shockWaveEffectSettings, false)
    // particleGroup.addPool(20, this.shockMistSettings, false)
    this.groups[BulletEffect.EFFECT_SHOCK_WAVE] = particleGroup
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {BulletEffect}
   */
  emmitShockWaveEffect(position) {
    if (!this.groups.hasOwnProperty(BulletEffect.EFFECT_SHOCK_WAVE)) {
      throw Error(`Unknown group ${BulletEffect.EFFECT_SHOCK_WAVE}. Before call method 'emmitShootEffect' you must create shootEffect. Please try to use method 'createShootEffect'`)
    }

    const particleGroup = this.groups[BulletEffect.EFFECT_SHOCK_WAVE]
    particleGroup.triggerPoolEmitter(1, position)
    return this
  }

  /**
   *
   * @returns {Mesh}
   */
  getShockWaveMesh() {
    if (!this.groups.hasOwnProperty(BulletEffect.EFFECT_SHOCK_WAVE)) {
      throw Error(`Unknown group ${BulletEffect.EFFECT_SHOCK_WAVE}. Before call method 'getShootEffectMesh' you must create shootEffect. Please try to use method 'createShootEffect'`)
    }
    return this.groups[BulletEffect.EFFECT_SHOCK_WAVE]['mesh']
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
}