
export default class RouteItem {
  /**
   *
   * @param {VueComponent|Object} component
   * @param {string} name
   * @param {string} path
   */
  constructor(component, name, path) {
    /**
     *
     * @type {string}
     */
    this.path = path

    /**
     *
     * @type {VueComponent|Object}
     */
    this.component = component

    /**
     *
     * @type {string|?}
     */
    this.icon = null

    /**
     *
     * @type {string|?}
     */
    this.img = null

    /**
     *
     * @type {string}
     */
    this.name = name

    /**
     *
     * @type {string|?}
     */
    this.description = null

    /**
     *
     * @type {boolean}
     */
    this.keepAlive = false

    /**
     *
     * @type {Array.<string>}
     */
    this.types = []

    /**
     *
     * @type {Array.<RouteItem>}
     */
    this.children = []
  }

  /**
   *
   * @param {string} value
   * @returns {RouteItem}
   */
  setIcon(value) {
    this.icon = value
    return this
  }

  /**
   *
   * @param {string} value
   * @returns {RouteItem}
   */
  setImg(value) {
    this.img = value
    return this
  }

  /**
   *
   * @param {string} value
   * @returns {RouteItem}
   */
  setDescription(value) {
    this.description = value
    return this
  }

  /**
   *
   * @param {boolean} value
   * @returns {RouteItem}
   */
  setKeepAlive(value) {
    this.keepAlive = value
    return this
  }

  /**
   *
   * @param {string} type
   * @returns {RouteItem}
   */
  addType(type) {
    this.types.push(type)
    return this
  }

  /**
   *
   * @param {RouteItem} routeItem
   * @returns {RouteItem}
   */
  addChildren(routeItem) {
    this.children.push(routeItem)
    return this
  }
}