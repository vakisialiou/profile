import Mesh from './../Mesh'
import Scene from './../Scene'
import PerspectiveCamera from './../PerspectiveCamera'
import WebGLRenderer from './../WebGLRenderer'
import * as constants from './../constants'
import * as shapeBox from '../primitives/box'
import { degToRad } from './../../lib/math'

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

  scene.background = [0.0, 1.0, 1.0, 1.0]
  camera.position = [0, 0, 200]
  camera.target = [0, 0, 0]

  const cubeGeometry = { vertices: shapeBox.vertices }
  const cubeMaterial = { colors: shapeBox.colors, size: 3, side: constants.SIDE_BACK, wireframe: false }

  const cube0 = new Mesh(cubeGeometry, cubeMaterial).setPosition([    0, 100,  0]).setScale([0.1, 0.1, 0.1]).setName('BOX-0')
  const cube1 = new Mesh(cubeGeometry, cubeMaterial).setPosition([  100, 0, -500]).setName('BOX-1')
  const cube2 = new Mesh(cubeGeometry, cubeMaterial).setPosition([    0, 0, -500]).setScale([3, 3, 3]).setName('BOX-2')
  const cube3 = new Mesh(cubeGeometry, cubeMaterial).setPosition([- 100, 0, -500]).setName('BOX-3')

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
          mesh.position[0] = r0 * Math.cos(angle0)
          mesh.position[1] = r0 * Math.sin(angle0)
          break
        case 'BOX-1':
          angle1 += 0.009
          mesh.position[0] = r1 * Math.cos(angle1)
          mesh.position[1] = r1 * Math.sin(angle1)
          break
        case 'BOX-2':
          mesh.rotation[1] += 0.005
          break
        case 'BOX-3':
          mesh.rotation[2] += 0.005
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