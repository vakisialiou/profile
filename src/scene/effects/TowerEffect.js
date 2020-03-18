import { SPE } from '@scene/libs/SPE'
import { AdditiveBlending, Color, Vector3 } from 'three'

export default class TowerEffect {
  constructor() {

    this.shootEffectSettings = {
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

    this.groups = {}
  }

  static EFFECT_SHOT = 'EFFECT_SHOT'

  /**
   *
   * @param {Texture} texture
   * @returns {TowerEffect}
   */
  createShootEffect(texture) {
    if (this.groups.hasOwnProperty(TowerEffect.EFFECT_SHOT)) {
      throw new Error(`Effect '${TowerEffect.EFFECT_SHOT}' has already created in TowerEffect`)
    }
    const particleGroup = new SPE.Group({
      texture: { value: texture },
      blending: AdditiveBlending,
      maxParticleCount: 200
    })

    particleGroup.addPool(10, this.shootEffectSettings, false)
    this.groups[TowerEffect.EFFECT_SHOT] = particleGroup
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {TowerEffect}
   */
  emmitShootEffect(position) {
    if (!this.groups.hasOwnProperty(TowerEffect.EFFECT_SHOT)) {
      throw Error(`Unknown group ${TowerEffect.EFFECT_SHOT}. Before call method 'emmitShootEffect' you must create shootEffect. Please try to use method 'createShootEffect'`)
    }

    const particleGroup = this.groups[TowerEffect.EFFECT_SHOT]
    particleGroup.triggerPoolEmitter(1, position)
    return this
  }

  /**
   *
   * @returns {Mesh}
   */
  getShootEffectMesh() {
    if (!this.groups.hasOwnProperty(TowerEffect.EFFECT_SHOT)) {
      throw Error(`Unknown group ${TowerEffect.EFFECT_SHOT}. Before call method 'getShootEffectMesh' you must create shootEffect. Please try to use method 'createShootEffect'`)
    }
    return this.groups[TowerEffect.EFFECT_SHOT]['mesh']
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
}