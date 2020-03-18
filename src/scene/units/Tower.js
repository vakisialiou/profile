import Unit from './Unit'
import { Vector3, Matrix4, Quaternion } from 'three'
import MathObject from '@scene/helper/MathObject'

export default class Tower extends Unit {
  constructor(gltf) {
    super(gltf)

    /**
     *
     * @type {(Object3D|Mesh|Group)}
     */
    this.target = null

    /**
     *
     * @type {Group}
     */
    this.head = gltf.model.getObjectByName('Head')

    /**
     * @typedef {Object} GunOptions
     * @property {(Object3D|Mesg|Group)} model
     * @property {number} reloadTime
     * @property {number} lastShotTime
     */
    /**
     *
     * @type {GunOptions[]}
     */
    this.chargeOptions = [
      {
        model: gltf.model.getObjectByName('Weapon_Top_Left_Trap'),
        reloadTime: 4000,
        lastShotTime: 0,
        enabled: true,
      },
      {
        model: gltf.model.getObjectByName('Weapon_Top_Right_Trap'),
        reloadTime: 4000,
        lastShotTime: 0,
        enabled: true,
      },
      {
        model: gltf.model.getObjectByName('Weapon_Bottom_Left_Trap'),
        reloadTime: 4000,
        lastShotTime: 0,
        enabled: true,
      },
      {
        model: gltf.model.getObjectByName('Weapon_Bottom_Right_Trap'),
        reloadTime: 4000,
        lastShotTime: 0,
        enabled: true,
      }
    ]

    /**
     *
     * @type {Group}
     */
    this.weaponHinge = gltf.model.getObjectByName('Weapon_Hinge')

    /**
     *
     * @type {Matrix4}
     */
    this.rotationMatrix = new Matrix4()

    /**
     *
     * @type {Quaternion}
     */
    this.targetRotationHead = new Quaternion()

    /**
     *
     * @type {Quaternion}
     */
    this.targetRotationWeaponHinge = new Quaternion()

    /**
     *
     * @type {MathObject}
     */
    this.mathHead = new MathObject(this.head)

    /**
     *
     * @type {MathObject}
     */
    this.mathWeaponHinge = new MathObject(this.weaponHinge)
  }

  static EVENT_ADD_BULLET = 'EVENT_ADD_BULLET'

  /**
   *
   * @param {(Object3D|Mesh|Group)} target
   * @returns {Tower}
   */
  setTarget(target) {
    this.target = target

    // Решено:
    // 1. Вращение башни по оси Y в рандомную сторону. setFromAxisAngle
    // this.targetRotationHead.setFromAxisAngle(new Vector3(0, 1, 0), _Math.randFloat(-Math.PI, Math.PI));
    // 1.a. на каждый фрэйм вызвать:
    // this.head.quaternion.rotateTowards(this.targetRotationHead, speed * delta)

    // Решено:
    // 2.1. Вращение башни по оси Y в сторону цели. setFromAxisAngle
    const angle1 = this.mathHead.angleToPointXZ(this.target.position)
    this.targetRotationHead.setFromAxisAngle(new Vector3(0, 1, 0), angle1);
    // 2.1.a. на каждый фрэйм вызвать:
    // this.head.quaternion.rotateTowards(this.targetRotationHead, speed * delta)


    // Решено:
    // 2.2. Вращение башни по оси Y в сторону цели. setFromRotationMatrix
    // const position = this.mathHead.position()
    // this.rotationMatrix.lookAt(position, new Vector3().copy(this.target.position).setY(position.y), this.head.up)
    // this.targetRotationHead.setFromRotationMatrix(this.rotationMatrix)
    // 2.1.a. на каждый фрэйм вызвать:
    // this.head.quaternion.rotateTowards(this.targetRotationHead, speed * delta)


    // Решено:
    // 3. Получить позицию точки в направлении объекта заданную длиной.
    // const headNextPoint = this.mathHead.nextPoint(200)


    // Решено:
    // 4. Получить противоположную позицию цели по осям XZ.
    // const inversePoint = this.mathHead.inverseTargetXZ(this.target.position)



    // Решено:
    // Направление пушек в сторону цели по оси XY
    const angle2 = this.mathWeaponHinge.angleToPointXY(this.target.position)
    this.targetRotationWeaponHinge.setFromAxisAngle(new Vector3(1, 0, 0), angle2);

    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {Tower}
   */
  update(delta) {
    super.update(delta)

    if (this.target) {
      const speedHead = 1.5
      this.head.quaternion.rotateTowards(this.targetRotationHead, speedHead * delta)

      const speedWeaponHinge = 0.3
      this.weaponHinge.quaternion.rotateTowards(this.targetRotationWeaponHinge, speedWeaponHinge * delta)

      if (this.head.quaternion.equals(this.targetRotationHead) && this.weaponHinge.quaternion.equals(this.targetRotationWeaponHinge)) {
        this._charge((gunOptions) => {
          this.dispatchEvent({ type: Tower.EVENT_ADD_BULLET, gunOptions })
        })
      }
    }
    return this
  }

  /**
   *
   * @param {GunOptions} gunOptions
   * @callback whenGunCharged
   */

  /**
   *
   * @param {whenGunCharged} callback - will be called when gun is charged
   * @returns {Tower}
   * @private
   */
  _charge(callback) {
    const now = Date.now()
    for (const gunOptions of this.chargeOptions) {
      if ((gunOptions.lastShotTime + gunOptions.reloadTime) > now) {
        continue
      }
      gunOptions.lastShotTime = now
      callback(gunOptions)
    }
    return this
  }
}