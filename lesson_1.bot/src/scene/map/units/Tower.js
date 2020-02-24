import ModelTower from './../models/ModelTower'
import { Object3DFollower } from '../../lib'
import { Vector3 } from 'three'

export default class Tower extends ModelTower {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   * @param {string} name
   */
  constructor(team, gltf, name) {
    super(team, gltf)

    this.name = name

    /**
     *
     * @type {Object3DFollower}
     */
    this.object3DFolowerHead = new Object3DFollower(this.head, 1.5).useObjectAxis(0, 1, 0)

    /**
     *
     * @type {Object3DFollower}
     */
    this.object3DFolowerHinge = new Object3DFollower(this.weaponHinge, 1.5)

    /**
     *
     * @type {number}
     */
    this.attackRadius = 100

    /**
     *
     * @type {(ModelBot|ModelBase|ModelTower|null)}
     */
    this.attacTarget = null

    /**
     *
     * @type {Array.<{expiredTime: number, interval: number, reference: (Object3D|Mesh)}>}
     */
    this.weaponsOptions = [
      { interval: 0.6000000238418579, expiredTime: 0, reference: this.weaponTopLeftTrap },
      { interval: 0.6000000238418579, expiredTime: 0, reference: this.weaponTopRightTrap },
      { interval: 0.6000000238418579, expiredTime: 0, reference: this.weaponBottomLeftTrap },
      { interval: 0.6000000238418579, expiredTime: 0, reference: this.weaponBottomRightTrap }
    ]

    this.tmp = new Vector3()

    this.dyingEvent(() => {
      setInterval(() => this.dispatchDestroyEvent(), 50)
    })
  }

  tryCaptureTarget(models) {
    if (this.destroyed) {
      return this
    }

    if (this.attacTarget && (this.attacTarget.destroyed || this.attacTarget.disabled)) {
      this.attacTarget = null
    }

    if (this.attacTarget) {
      if (this.position.distanceTo(this.attacTarget.position) <= this.attackRadius) {
        // Has target. Do nothing.
        return this
      } else {
        // Цель потеряна. Нужно найти новую цель.
        this.attacTarget = null
      }
    }

    for (const model of models) {
      if (model.destroyed || model.disabled) {
        continue
      }
      if (this.position.distanceTo(model.position) <= this.attackRadius) {
        // Target captured.
        this.attacTarget = model
        return this
      }
    }

    return this
  }

  update(delta) {
    super.update(delta)

    if (this.destroyed || this.disabled) {
      return this
    }

    for (const weapon of this.weaponsOptions) {
      weapon.expiredTime += delta
    }

    if (this.attacTarget) {
      this.object3DFolowerHead.setTarget(this.attacTarget.position).update(delta)
      // this.object3DFolowerHinge.setTarget(this.attacTarget.position).update(delta)


      // const p = this.weaponHinge.getWorldPosition(this.tmp).clone()
      // const angle = p.angleTo(this.attacTarget.position)
      // this.weaponHinge.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), angle)
      // this.weaponHinge.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), angle)
      // this.weaponHinge.lookAt(new Vector3().copy(this.attacTarget.getWorldPosition(this.tmp)))

      for (const weapon of this.weaponsOptions) {
        if (weapon.expiredTime >= weapon.interval && this.object3DFolowerHead.isRotationReached) {
          weapon.expiredTime = 0
          const position = weapon.reference.getWorldPosition(new Vector3())
          const direction = weapon.reference.getWorldDirection(new Vector3())
          // this.weaponHinge
          this.dispatchShotEvent(this.attacTarget, { position, direction: new Vector3().sub(direction) })
        }
      }
    }
  }
}