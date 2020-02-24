import { BoxBufferGeometry, MeshStandardMaterial, Mesh } from 'three'

export const createElementaryCube = (width = 200, height = 200, depth = 200, color = 0xFF0000) => {
  const geometry = new BoxBufferGeometry(width, height, depth)
  const material = new MeshStandardMaterial({ color })
  return new Mesh(geometry, material)
}