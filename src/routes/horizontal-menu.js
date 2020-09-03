import RouteItem from './RouteItem'
import ThreeJsPage from './../pages/ThreeJsPage'
import ProfilePage from './../pages/ProfilePage'
import WebGLPage from './../pages/WebGLPage'
import MarkdownPage from './../pages/MarkdownPage'

export const TYPE_MENU_HOME = 'home'
export const TYPE_MENU_HORIZONTAL = 'horizontal'

export const routes = [
  new RouteItem(ProfilePage, 'Профиль', '/')
    .addType(TYPE_MENU_HOME),

  new RouteItem(ThreeJsPage, 'ThreeJS', '/three')
    .addType(TYPE_MENU_HORIZONTAL),

  new RouteItem(WebGLPage, 'WebGL', '/webgl')
    .addType(TYPE_MENU_HORIZONTAL),

  new RouteItem(MarkdownPage, 'Helper', '/helper')
    .addType(TYPE_MENU_HORIZONTAL)
    .addChildren(
      new RouteItem(MarkdownPage, 'Докер', '/helper/:md', '/helper/docker')
        .addType(TYPE_MENU_HORIZONTAL)
    ),
]