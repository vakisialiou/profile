import { PerspectiveCamera, Scene, WebGLRenderer, TextureLoader } from 'three'
import { HemisphereLight, DirectionalLight } from 'three'
import { createElementaryCube } from './../objects/cube'

/**
 *
 * @param {Element} container
 */
export const render = (container) => {
  const width = window.innerWidth
  const height = window.innerHeight

  const camera = new PerspectiveCamera(70, width / height, 1, 1000)
  camera.position.z = 400

  const scene = new Scene()

  const hemiLight = new HemisphereLight(0xffffff, 0x444444)
  scene.add(hemiLight)

  const dirLight = new DirectionalLight(0xffffff)
  scene.add(dirLight)

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  const cube = createElementaryCube()
  scene.add(cube)

  const textureAlbedo = new TextureLoader().load('/textures/Medieval Cobblestone/Albedo.jpg')
  const textureAmbientOcclusion = new TextureLoader().load('/textures/Medieval Cobblestone/Ambient_Occlusion.jpg')
  const textureNormal = new TextureLoader().load('/textures/Medieval Cobblestone/Normal.jpg')
  const textureRoughness = new TextureLoader().load('/textures/Medieval Cobblestone/Roughness.jpg')

  setTimeout(() => {
    cube.material.color = null
    cube.material.map = textureAlbedo
    cube.material.aoMap = textureAmbientOcclusion
    cube.material.normalMap = textureNormal
    cube.material.roughnessMap = textureRoughness
    cube.material.needsUpdate = true
  }, 2000)

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cube.rotation.x += 0.005
    cube.rotation.y += 0.001
  }

  const resize = () => {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  animate()
  window.addEventListener('resize', resize, false)
}