import HomePage from './pages/HomePage'

import UnitPage from './pages/UnitPage'
import UnitGroundPage from './pages/UnitPage/pages/UnitGroundPage'
import UnitTowerPage from './pages/UnitPage/pages/UnitTowerPage'
import UnitBotPage from './pages/UnitPage/pages/UnitBotPage'

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
    path: '/debug',
    component: UnitPage,
    icon: null,
    name: 'Unit',
    types: ['horizontal'],
    children: [
      {
        path: '/unit/ground',
        component: UnitGroundPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Ground'
      },
      {
        path: '/unit/tower',
        component: UnitTowerPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Tower'
      },
      {
        path: '/unit/bot',
        component: UnitBotPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Bot'
      },
    ]
  },
]