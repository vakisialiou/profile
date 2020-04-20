import { routes as routesHomePage } from './home-page'
import { routes as routesHorizontalMenu, TYPE_MENU_HOME, TYPE_MENU_HORIZONTAL } from './horizontal'

export default class AppRoutes {
  constructor() {
    /**
     *
     * @type {Array.<RouteItem>}
     */
    this.fullRoutes = [ ...routesHomePage, ...routesHorizontalMenu ]
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
  homePageMenuRoutes() {
    return routesHomePage
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