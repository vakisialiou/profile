import HomePage from './pages/HomePage'

import GamePage from './pages/GamePage'
import GameDemoPage from './pages/GamePage/pages/DemoPage'
import GamePresentationPage from './pages/GamePage/pages/PresentationPage'

import DebugPage from './pages/DebugPage'
import ModelGroundPage from './pages/DebugPage/pages/ModelGroundPage'
import ModelTowerPage from './pages/DebugPage/pages/ModelTowerPage'

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
    path: '/game',
    component: GamePage,
    icon: null,
    name: 'Game',
    types: ['horizontal'],
    children: [
      {
        path: '/game/demo',
        component: GameDemoPage,
        icon: 'plug',
        name: 'Demo'
      },
      {
        path: '/game/presentation',
        component: GamePresentationPage,
        icon: 'folder-fill',
        name: 'Presentation'
      },
    ]
  },
  {
    path: '/debug',
    component: DebugPage,
    icon: null,
    name: 'Debug',
    types: ['horizontal'],
    children: [
      {
        path: '/model/ground',
        component: ModelGroundPage,
        icon: 'plug',
        keepAlive: true,
        name: 'Model Ground'
      },
      {
        path: '/model/tower',
        component: ModelTowerPage,
        icon: 'plug',
        keepAlive: true,
        name: 'Model Tower'
      },
    ]
  },
]