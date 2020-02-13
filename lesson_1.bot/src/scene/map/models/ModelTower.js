import {BoxGeometry, MeshBasicMaterial, Vector2} from 'three'
import Model from './base/Model'
import ModelOptionsTower from './base/ModelOptionsTower'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class ModelTower extends Model {
  /**
   *
   * @param {Team} team
   */
  constructor(team) {
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

    const loader = new GLTFLoader()
    loader.load('/models/tower/tower.glb', (glb) => {
      const mesh = glb.scene.children[0]
      mesh.material.metalness = 0.2
      mesh.scale.set(8,8,8)
      this.add(mesh)
    })
  }
}