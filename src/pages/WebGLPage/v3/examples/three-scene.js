import {
  Scene, PerspectiveCamera, WebGLRenderer,
  Mesh, MeshBasicMaterial, BoxGeometry,
  Vector3, Color, Object3D,
} from 'three'
import { normalize } from './../../lib/integer'

window.__cacheThreeJS = window.__cacheThreeJS || { resize: null, requestID: null }

Mesh.prototype.setPosition = function (v) {
  this.position.fromArray(v)
  return this
}

Mesh.prototype.setScale = function (v) {
  this.scale.fromArray(v)
  return this
}

Mesh.prototype.setName = function (name) {
  this.name = name
  return this
}

function radToDeg(r) {
  return r * 180 / Math.PI
}

function degToRad(d) {
  return d * Math.PI / 180
}

export const renderThreeScene = (canvas, offsetTop) => {
  // Before mount
  // -------------------------------------------------------------------------------------------------------------------
  clearRenderThreeScene()
  // Mounting
  // -------------------------------------------------------------------------------------------------------------------
  const scene = new Scene()
  const renderer = new WebGLRenderer({ antialias: true, canvas })
  const camera = new PerspectiveCamera(55, window.innerWidth / (window.innerHeight - offsetTop), 0.1, 10000)

  scene.background = new Color().setRGB(0.0, 1.0, 1.0)
  camera.position.copy(new Vector3(0, 80, 200))
  camera.lookAt(new Vector3(0, 0, 0))
  renderer.setSize(window.innerWidth, (window.innerHeight - offsetTop))

  const cubeGeometry = new BoxGeometry(50, 50, 50)

  const boxColors = [
    [80, 70, 200],
    [80, 70, 200],
    [200,  0, 120],
    [200,  70, 0],
    [0,  70, 120],
    [200,  200, 120],
  ]

  for (let i = 0; i < boxColors.length; i++) {
    const index = i * 2
    const color = {r: normalize(boxColors[i][0], 1, 255), g: normalize(boxColors[i][1], 1, 255), b: normalize(boxColors[i][2], 1, 255)}
    cubeGeometry.faces[index].color.setRGB(color.r, color.g, color.b)
    cubeGeometry.faces[index + 1].color.setRGB(color.r, color.g, color.b)
  }

  const cubeMaterial = new MeshBasicMaterial( { color: 0xffffff, vertexColors: true } );

  const cube0 = new Mesh(cubeGeometry, cubeMaterial).setPosition([    0, 100,  0]).setScale([0.1, 0.1, 0.1]).setName('THREE-JS-CUBE0')
  const cube1 = new Mesh(cubeGeometry, cubeMaterial).setPosition([  100, 0, -500]).setName('THREE-JS-CUBE1')
  const cube2 = new Mesh(cubeGeometry, cubeMaterial).setPosition([    0, 0, -500]).setName('THREE-JS-CUBE2')
  const cube3 = new Mesh(cubeGeometry, cubeMaterial).setPosition([- 100, 0, -500]).setName('THREE-JS-CUBE3')

  cube1.add(cube0)
  scene.add(cube1)
  scene.add(cube2)
  scene.add(cube3)

  const r0 = 40
  const r1 = 180
  let angle0 = degToRad(0)
  let angle1 = degToRad(0)

  const render = () => {
    window.__cacheThreeJS.requestID = requestAnimationFrame(render)
    scene.traverse((mesh) => {
      switch (mesh.name) {
        case 'THREE-JS-CUBE0':
          angle0 += 0.004
          mesh.position.x = r0 * Math.cos(angle0)
          mesh.position.y = r0 * Math.sin(angle0)
          break
        case 'THREE-JS-CUBE1':
          angle1 += 0.009
          mesh.position.x = r1 * Math.cos(angle1)
          mesh.position.y = r1 * Math.sin(angle1)
          break
        case 'THREE-JS-CUBE2':
          mesh.rotation.y += 0.005
          break
        case 'THREE-JS-CUBE3':
          mesh.rotation.z += 0.005
          break
      }
    })

    renderer.render(scene, camera)
  }

  // After mounted
  // -------------------------------------------------------------------------------------------------------------------
  window.__cacheThreeJS.resize = () => {
    camera.aspect = window.innerWidth / (window.innerHeight - offsetTop)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, (window.innerHeight - offsetTop))
  }
  window.addEventListener('resize', window.__cacheThreeJS.resize, false)
  render()
}

export const clearRenderThreeScene = () => {
  if (window.__cacheThreeJS.resize) {
    window.removeEventListener('resize', window.__cacheThreeJS.resize, false)
  }
  cancelAnimationFrame(window.__cacheThreeJS.requestID)
}