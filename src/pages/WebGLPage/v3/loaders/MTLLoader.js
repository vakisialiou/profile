import MeshBaseMaterial from './../MeshBaseMaterial'
import Color from './../Color'

export default class MTLLoader {
  constructor() {

  }

  /**
   *
   * @param {string} file
   * @returns {Promise<Array.<MeshBaseMaterial>>}
   */
  async load(file) {
    const str = await fetch(file)
      .then((res) => res.text())

    const materials = []

    const rows = str.split(/\n/)
    for (const row of rows) {
      const cells = row.split(/\s/)
      switch (cells[0]) {
        case '#':
          continue
        case 'newmtl':
          materials.push(new MeshBaseMaterial().setName(cells[1]))
          break
        case 'Ns':
          break
        case 'Ka':
          break
        case 'Kd':
          const material = materials[materials.length - 1]
          material.setColor(new Color().fromNormalizedArray(cells, 1))
          break
        case 'Ks':
          break
        case 'Ke':
          break
        case 'Ni':
          break
        case 'd':
          break
        case 'illum':
          break
      }
    }

    return materials
  }
}