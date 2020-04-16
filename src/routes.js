import HomePage from './pages/HomePage'

import ExamplesPage from './pages/ExamplesPage'
import GroundPage from './pages/ExamplesPage/pages/GroundPage'
import UnitTowerPage from './pages/ExamplesPage/pages/UnitTowerPage'
import UnitBotUserControlPage from './pages/ExamplesPage/pages/UnitBotUserControlPage'
import UnitBotAutoControlPage from './pages/ExamplesPage/pages/UnitBotAutoControlPage'
import UnitBotAnimationPage from './pages/ExamplesPage/pages/UnitBotAnimationPage'

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
        component: UnitTowerPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit tower'
      },
      {
        path: '/examples/bot-animation',
        component: UnitBotAnimationPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit bot animation'
      },
      {
        path: '/examples/bot-user-control',
        component: UnitBotUserControlPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit bot user control'
      },
      {
        path: '/examples/bot-auto-control',
        component: UnitBotAutoControlPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit bot auto control'
      },
    ]
  },
]