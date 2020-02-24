import { BoxGeometry, Math as _Math, MeshBasicMaterial, Quaternion } from 'three'
import Model from './base/Model'
import ModelOptionsTower from './base/ModelOptionsTower'
import AnimationTower from './animation/AnimationTower'

export default class ModelTower extends Model {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   */
  constructor(team, gltf) {
    super(team, new ModelOptionsTower().setHealth(300))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(10, 30, 10)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    /**
     *
     * @type {AnimationTower}
     */
    this.animation = new AnimationTower(gltf)

    this.head = gltf.model.getObjectByName('Head')
    this.tmpQuaternion = new Quaternion(0, 1, 0, 0)
    this.weaponTopLeftTrap = gltf.model.getObjectByName('Weapon_Top_Left_Trap')
    this.weaponTopRightTrap = gltf.model.getObjectByName('Weapon_Top_Right_Trap')
    this.weaponBottomLeftTrap = gltf.model.getObjectByName('Weapon_Bottom_Left_Trap')
    this.weaponBottomRightTrap = gltf.model.getObjectByName('Weapon_Bottom_Right_Trap')
    this.weaponHinge = gltf.model.getObjectByName('Weapon_Hinge')

    gltf.model.scale.set(8, 8, 8)
    gltf.model.position.setY(4)
    gltf.model.material.metalness = 0.2
    this.add(gltf.model)
  }

  /**
   *
   * @returns {ModelTower}
   */
  stopFollowingAnimation() {
    if (this.animation.actionFollowing.isRunning()) {
      this.animation.clearActiveAction()
    }
    return this
  }

  /**
   *
   * @param {Object3D} obj
   * @returns {number}
   */
  getQuaternionY360Rad(obj) {
    const angle = obj.quaternion.angleTo(this.tmpQuaternion)
    return obj.rotation.y < 0 ? Math.PI + angle : Math.PI - angle
  }

  /**
   *
   * @param {Object3D} obj
   * @returns {number}
   */
  getQuaternionY360Deg(obj) {
    return _Math.radToDeg(this.getQuaternionY360Rad(obj))
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    this.animation.update(delta)
  }
}