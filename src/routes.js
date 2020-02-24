import HomePage from './pages/HomePage'
import ThreeJSPage from './pages/ThreeJSPage'
import ThreeJSDemoPage from './pages/ThreeJSPage/pages/DemoPage'
import ThreeJSPresentationPage from './pages/ThreeJSPage/pages/PresentationPage'

export const routes = [
  {
    path: '/',
    component: HomePage,
    icon: null,
    name: 'Home',
    types: ['horizontal', 'home']
  },
  {
    path: '/three.js',
    component: ThreeJSPage,
    icon: null,
    name: 'ThreeJS',
    types: ['horizontal'],
    children: [
      {
        path: '/presentation',
        component: ThreeJSPresentationPage,
        icon: 'folder-fill',
        name: 'Presentation'
      },
      {
        path: '/demo',
        component: ThreeJSDemoPage,
        icon: 'plug',
        name: 'Demo'
      }
    ]
  },
]