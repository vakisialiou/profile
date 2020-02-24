import { CylinderGeometry, MeshBasicMaterial, Vector3 } from 'three'
import Model from './base/Model'
import ModelOptionsBot from './base/ModelOptionsBot'
import AnimationBot from './animation/AnimationBot'

export default class ModelBot extends Model {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   */
  constructor(team, gltf) {
    super(team, new ModelOptionsBot().setHealth(1500))

    /**
     *
     * @type {CylinderGeometry}
     */
    this.geometry = new CylinderGeometry(2, 2, 30)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    /**
     *
     * @type {AnimationBot}
     */
    this.animation = new AnimationBot(gltf)

    gltf.model.scale.set(0.1, 0.1, 0.1)
    this.add(gltf.model)

    this.tmp = new Vector3()

    /**
     *
     * @type {Object3D|Mesh}
     */
    this.weapon = gltf.model.getObjectByName('Weapon')

    this.weaponScalar = new Vector3(0, 1.6, 0)
    if (!this.weapon) {
      throw Error('Weapon is not found.')
    }
  }

  /**
   *
   * @returns {Vector3}
   */
  get weaponPosition() {
    return this.weapon.getWorldPosition(this.tmp).add(this.weaponScalar)
  }

  /**
   *
   * @returns {ModelBot}
   */
  dyingAnimation(callback) {
    const dyingEvent = () => {
      callback()
      this.animation.clearActiveAction()
      this.animation.mixer.removeEventListener('loop', dyingEvent)
    }
    this.animation.mixer.addEventListener('loop', dyingEvent)
    this.animation.dyingAnimation()
    return this
  }

  /**
   *
   * @returns {ModelBot}
   */
  walkingAnimation() {
    this.animation.walkingAnimation()
    return this
  }

  /**
   *
   * @returns {ModelBot}
   */
  shootingAnimation(callback) {
    const shootingEvent = () => {
      this.animation.clearActiveAction()
      this.animation.mixer.removeEventListener('loop', shootingEvent)
    }
    this.animation.mixer.addEventListener('loop', shootingEvent)
    this.animation.shootingAnimation()
    setTimeout(callback, 200)
    return this
  }

  /**
   *
   * @returns {ModelBot}
   */
  idleAnimation() {
    this.animation.idleAnimation()
    return this
  }

  update(delta) {
    this.animation.update(delta)
  }
}