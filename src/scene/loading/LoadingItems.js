
export default class LoadingItems {
  /**
   *
   * @param {(GLTFLoader|TextureLoader|AudioLoader|Object)} loader
   */
  constructor(loader) {

    /**
     * @typedef {Object} LoadingItem
     * @property {string} name
     * @property {string} path
     * @property {boolean} [enabled]
     */

    /**
     *
     * @type {Array.<LoadingItem>}
     */
    this.items = []

    /**
     *
     * @type {Object}
     */
    this.loadedItems = {}

    /**
     *
     * @type {(GLTFLoader|TextureLoader|AudioLoader|Object)}
     */
    this.loader = loader ? new loader() : null
  }

  /**
   *
   * @param {string} name
   * @param {boolean} [value]
   * @returns {LoadingItems}
   */
  enableItem(name, value = true) {
    for (const item of this.items) {
      if (item.name === name) {
        item.enabled = value
        break
      }
    }
    return this
  }

  /**
   *
   * @param {Array.<LoadingItem>} items
   * @returns {LoadingItems}
   */
  setItems(items) {
    for (const item of items) {
      if (item.enabled === undefined) {
        item.enabled = true
      }
      this.addItem(item.name, item.path, item.enabled)
    }
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string} path
   * @param {boolean} [enabled]
   * @returns {LoadingItems}
   */
  addItem(name, path, enabled = true) {
    this.items.push({ name, path, enabled })
    return this
  }

  /**
   *
   * @returns {Promise<Object>}
   */
  async load(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, resolve, null, reject)
    })
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async preset() {
    for (const item of this.items) {
      if (!item.enabled) {
        continue
      }
      try {
        this.loadedItems[item.name] = await this.load(item.path)
      } catch (e) {
        throw new Error(`Can not load item "${item.name}:${item.path}". Look at LoadingItems.load()`)
      }
    }
  }

  /**
   *
   * @param {string} name
   * @returns {Object}
   */
  getItem(name) {
    return this.loadedItems[name] || null
  }
}