import { routes as routesThreeJsPage } from './three-js-page'
import { routes as routesHorizontalMenu, TYPE_MENU_HOME, TYPE_MENU_HORIZONTAL } from './horizontal-menu'

export default class AppRoutes {
  constructor() {
    /**
     *
     * @type {Array.<RouteItem>}
     */
    this.fullRoutes = [ ...routesThreeJsPage, ...routesHorizontalMenu ]
  }

  /**
   *
   * @returns {Array.<string>}
   */
  keepAliveRoutes() {
    return this.fullRoutes
      .filter((item) => item.keepAlive)
      .map((route) => route.component.name)
  }

  /**
   *
   * @returns {RouteItem[]}
   */
  threeJSPageMenuRoutes() {
    return routesThreeJsPage
  }

  /**
   *
   * @returns {RouteItem[]}
   */
  horizontalMenuRoutes() {
    return routesHorizontalMenu.filter((route) => route.types.includes(TYPE_MENU_HORIZONTAL))
  }

  /**
   *
   * @returns {RouteItem}
   */
  homePageRouter() {
    return routesHorizontalMenu.find((route) => route.types.includes(TYPE_MENU_HOME))
  }
}