import HomePage from './pages/HomePage'

import ExamplesPage from './pages/ExamplesPage'
import UnitGroundPage from './pages/ExamplesPage/pages/UnitGroundPage'
import UnitTowerPage from './pages/ExamplesPage/pages/UnitTowerPage'
import UnitBotPage from './pages/ExamplesPage/pages/UnitBotPage'

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
        component: UnitGroundPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Ground'
      },
      {
        path: '/examples/tower',
        component: UnitTowerPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Tower'
      },
      {
        path: '/examples/bot',
        component: UnitBotPage,
        icon: 'folder',
        keepAlive: true,
        name: 'Unit Bot'
      },
    ]
  },
]