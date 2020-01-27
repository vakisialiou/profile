import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { HemisphereLight, DirectionalLight, PointLight, Color } from 'three'
let _gui = null

export default class DebugPanel {
  static gui() {
    if (_gui) {
      return _gui
    }
    _gui = new GUI()
    _gui.name = 'DebugPanel'
    _gui.width = 300
    _gui.useLocalStorage = true
    _gui.remember(_gui.load)
    return _gui
  }

  /**
   * @returns {void}
   */
  static clear() {
    if (_gui) {
      _gui.domElement.offsetParent.removeChild(_gui.domElement)
      _gui = null
    }
  }

  /**
   *
   * @param {Object|GUI} folder
   * @param {Object} data
   * @param {string} property
   * @returns {void}
   */
  static addColor(folder, data, property) {
    const tmp = { [property]: `#${data[property].getHexString()}` }
    _gui.remember(tmp)
    folder.addColor(tmp, property).onChange((value) => {
      data[property].setHex(Number(value.replace('#', '0x')))
      return value
    })
  }

  /**
   *
   * @param {Object|GUI} folder
   * @param {Object} data
   * @param {number} [max]
   * @param {number} [min]
   * @param {number} [step]
   * @param {string|?} [property]
   * @returns {void}
   */
  static addVector3(folder, data, max = 50, min = -50, step = 10, property = null, ) {
    data = property ? data[property] : data
    _gui.remember(data)
    folder.add(data, 'x').min(min).max(max).step(step)
    folder.add(data, 'y').min(min).max(max).step(step)
    folder.add(data, 'z').min(min).max(max).step(step)
  }

  /**
   *
   * @param {string} name
   * @returns {Object|GUI}
   */
  static createFolder(name) {
    const gui = DebugPanel.gui()
    return gui.addFolder(name)
  }

  /**
   *
   * @param {HemisphereLight} light
   * @returns {void}
   */
  static folderHemiLight(light) {
    const folder = DebugPanel.createFolder('Hemi Light')
    DebugPanel.addColor(folder, light, 'color')
    DebugPanel.addVector3(folder, light,  100, - 100, 1, 'position')
  }

  /**
   *
   * @param {DirectionalLight} light
   */
  static folderDirLight(light) {
    const folder = DebugPanel.createFolder('Dir Light')
    DebugPanel.addColor(folder, light, 'color')
    DebugPanel.addVector3(folder, light,  100, - 100, 1, 'position')
  }

  /**
   *
   * @param {PointLight} light
   * @returns {void}
   */
  static folderPointLight(light) {
    const folder = DebugPanel.createFolder('Point Light')
    DebugPanel.addColor(folder, light, 'color')
    DebugPanel.addVector3(folder, light,  100, - 100, 1, 'position')
  }

  /**
   *
   * @param {Ground} ground
   * @returns {void}
   */
  static folderGround(ground) {
    const data = {
      enableCellHelper: false,
      enableGridHelper: false,
      enableGridPointsHelper: false,
    }
    const folder = DebugPanel.createFolder('Ground')
    _gui.remember(data)
    folder.add(data, 'enableCellHelper').onChange((value) => {
      value ? ground.setCellHelper() : ground.removeCellHelper()
    })

    folder.add(data, 'enableGridHelper').onChange((value) => {
      value ? ground.setGridHelper() : ground.removeGridHelper()
    })

    folder.add(data, 'enableGridPointsHelper').onChange((value) => {
      value ? ground.setGridPointsHelper() : ground.removeGridPointsHelper()
    })

    const formatClickPoint = () => JSON.stringify(ground.cellHelperMesh.position)
    const pointData = {
      clickPoint: formatClickPoint()
    }

    const speeder = folder.add(pointData, 'clickPoint').listen()
    speeder.domElement.style.opacity = .5

    setInterval(() => {
      const value = formatClickPoint()
      if (value !== pointData.clickPoint) {
        speeder.setValue(formatClickPoint())
      }
    }, 500)

    setTimeout(() => {
      data.enableCellHelper ? ground.setCellHelper() : ground.removeCellHelper()
      data.enableGridHelper ? ground.setGridHelper() : ground.removeGridHelper()
      data.enableGridPointsHelper ? ground.setGridPointsHelper() : ground.removeGridPointsHelper()
    }, 10)
  }

  /**
   * @returns {void}
   */
  static folderControls() {
    const data = {}
    const folders = _gui.__folders
    for (const folderName in folders) {
      if (!folders.hasOwnProperty(folderName)) {
        continue
      }
      folders[folderName].hide()
      data[folderName] = false
    }

    const folder = DebugPanel.createFolder('Controls')
    _gui.remember(data)
    for (const folderName in data) {
      if (!folders.hasOwnProperty(folderName)) {
        continue
      }
      folder.add(data, folderName).onChange((value) => {
        value ? folders[folderName].show() : folders[folderName].hide()
      })
    }

    setTimeout(() => {
      for (const folderName in data) {
        if (!folders.hasOwnProperty(folderName)) {
          continue
        }
        if (data[folderName]) {
          folders[folderName].show()
        }
      }
    }, 1000)

  }
}