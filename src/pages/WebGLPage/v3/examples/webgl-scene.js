import Mesh from './../Mesh'
import Scene from './../Scene'
import PerspectiveCamera from './../PerspectiveCamera'
import WebGLRenderer from './../WebGLRenderer'
import MeshBaseMaterial from './../MeshBaseMaterial'
import BufferGeometry from './../BufferGeometry'
import * as shapeBox from '../primitives/box'
import { degToRad } from './../../lib/math'
import Vector3 from './../Vector3'

import OBJLoader from './../loaders/OBJLoader'
import MTLLoader from './../loaders/MTLLoader'

window.__cacheWebGL = window.__cacheWebGL || { resize: null, requestID: null }

export const renderWebGlScene = (canvas, offsetTop, update) => {
  // Before mount
  // -------------------------------------------------------------------------------------------------------------------
  clearRenderWebGLScene()

  // Mounting
  // -------------------------------------------------------------------------------------------------------------------
  const scene = new Scene()
  const renderer = new WebGLRenderer(canvas)

  const aspect = (window.innerWidth / 2) / (window.innerHeight - offsetTop)
  const camera = new PerspectiveCamera(55, aspect, 0.1, 2000)

  camera.position.set(0, 0, 200)

  new MTLLoader().load('/models/cube.mtl').then((materials) => {
    new OBJLoader().setMTLMaterials(materials).load('/models/cube.obj').then((res) => {
      res.position.y = - 40
      res.position.x = - 80
      res.scale.set(26, 26, 26)
      scene.add(res)
    })
  })

  const cubeGeometry = new BufferGeometry()
  cubeGeometry.setAttribute('position', { vertices: new Float32Array(shapeBox.vertices), itemSize: 3 })
  cubeGeometry.setAttribute('color', { vertices: new Uint8Array(shapeBox.colors), itemSize: 3 })

  const cubeMaterial = new MeshBaseMaterial().useVertexColors()
  const cube0 = new Mesh(cubeGeometry, cubeMaterial).setPosition(new Vector3(0, 100,  0)).setScale(new Vector3(0.1, 0.1, 0.1)).setName('BOX-0')
  const cube1 = new Mesh(cubeGeometry, cubeMaterial).setPosition(new Vector3(100, 0, -500)).setName('BOX-1')
  const cube2 = new Mesh(cubeGeometry, cubeMaterial).setPosition(new Vector3(0, 0, -500)).setScale(new Vector3(3, 3, 3)).setName('BOX-2')
  const cube3 = new Mesh(cubeGeometry, cubeMaterial).setPosition(new Vector3(- 100, 0, -500)).setName('BOX-3')

  cube1.add(cube0)
  scene.add(cube1)
  scene.add(cube2)
  scene.add(cube3)

  renderer.resize((window.innerWidth / 2), (window.innerHeight - offsetTop)).update(scene, camera)

  const r0 = 40
  const r1 = 180
  let angle0 = degToRad(0)
  let angle1 = degToRad(0)

  const render = () => {
    window.__cacheWebGL.requestID = requestAnimationFrame(render)
    update({ renderer, scene, camera, cubeMaterial })

    scene.traverse((mesh) => {
      switch (mesh.name) {
        case 'BOX-0':
          angle0 += 0.004
          mesh.position.x = r0 * Math.cos(angle0)
          mesh.position.y = r0 * Math.sin(angle0)
          break
        case 'BOX-1':
          angle1 += 0.009
          mesh.position.x = r1 * Math.cos(angle1)
          mesh.position.y = r1 * Math.sin(angle1)
          break
        case 'BOX-2':
          mesh.rotation.y += 0.005
          break
        case 'BOX-3':
          mesh.rotation.z += 0.005
          break
      }
    })

    renderer.update(scene, camera)
  }

  // After mounted
  // -------------------------------------------------------------------------------------------------------------------
  window.__cacheWebGL.resize = () => {
    camera.aspect = (window.innerWidth / 2) / (window.innerHeight - offsetTop)
    camera.update()

    renderer.resize((window.innerWidth / 2), (window.innerHeight - offsetTop))
  }
  window.addEventListener('resize', window.__cacheWebGL.resize, false)
  render()
}

export const clearRenderWebGLScene = () => {
  if (window.__cacheWebGL.resize) {
    window.removeEventListener('resize', window.__cacheWebGL.resize, false)
  }
  cancelAnimationFrame(window.__cacheWebGL.requestID)
}