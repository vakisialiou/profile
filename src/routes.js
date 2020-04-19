import HomePage from './pages/HomePage'

import ExamplesPage from './pages/ExamplesPage'
import GroundPage from './pages/ExamplesPage/pages/GroundPage'
import TowerPage from './pages/ExamplesPage/pages/TowerPage'
import OutlinePage from './pages/ExamplesPage/pages/OutlinePage'
import BotUserControlPage from './pages/ExamplesPage/pages/BotUserControlPage'
import BotAutoControlPage from './pages/ExamplesPage/pages/BotAutoControlPage'
import BotAnimationPage from './pages/ExamplesPage/pages/BotAnimationPage'

export const routes = [
  {
    path: '/',
    component: HomePage,
    icon: null,
    name: 'Home',
    keepAlive: true,
    types: ['horizontal', 'home']
  },
  {
    path: '/examples',
    component: ExamplesPage,
    icon: null,
    name: 'Examples',
    types: ['horizontal'],
    children: [
      {
        path: '/examples/ground',
        component: GroundPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Ground'
      },
      {
        path: '/examples/tower',
        component: TowerPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Towers'
      },
      {
        path: '/examples/bot-animation',
        component: BotAnimationPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Bot animations'
      },
      {
        path: '/examples/bot-user-control',
        component: BotUserControlPage,
        icon: 'folder',
        keepAlive: true,
        name: 'User bot controls'
      },
      {
        path: '/examples/bot-auto-control',
        component: BotAutoControlPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Auto bot controls'
      },
      {
        path: '/examples/outline',
        component: OutlinePage,
        icon: 'folder',
        keepAlive: true,
        name: 'Outline'
      },
    ]
  },
]