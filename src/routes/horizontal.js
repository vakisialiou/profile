import RouteItem from './RouteItem'
import HomePage from './../pages/HomePage'
import ProfilePage from './../pages/ProfilePage'

export const TYPE_MENU_HOME = 'home'
export const TYPE_MENU_HORIZONTAL = 'horizontal'

export const routes = [
  new RouteItem(HomePage, 'Home', '/')
    .addType(TYPE_MENU_HORIZONTAL)
    .addType(TYPE_MENU_HOME),

  new RouteItem(ProfilePage, 'Profile', '/profile')
    .addType(TYPE_MENU_HORIZONTAL),
]