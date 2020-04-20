import RouteItem from './RouteItem'
import GroundPage from './../pages/ExamplesPage/pages/GroundPage'
import TowerPage from './../pages/ExamplesPage/pages/TowerPage'
import OutlinePage from './../pages/ExamplesPage/pages/OutlinePage'
import BotUserControlPage from './../pages/ExamplesPage/pages/BotUserControlPage'
import BotAutoControlPage from './../pages/ExamplesPage/pages/BotAutoControlPage'
import BotAnimationPage from './../pages/ExamplesPage/pages/BotAnimationPage'

export const routes = [
  new RouteItem(GroundPage, 'Ground', '/example/ground')
    .setDescription('Simple example of ground. You can get click, face, vertex and segment position.'),

  new RouteItem(TowerPage, 'Tower', '/example/tower')
    .setDescription('Upload a simple model to the scene. Make animation, shooting and sound effects. Explosion of bullets.'),

  new RouteItem(OutlinePage, 'Outline', '/example/outline')
    .setDescription('Select a model.'),

  new RouteItem(BotAnimationPage, 'Bot animations', '/example/bot/animations')
    .setDescription('Various bot animations.'),

  new RouteItem(BotUserControlPage, 'Bot user-controls', '/example/bot/user-controls')
    .setDescription('The Bos follows the point set by the cursor and attacks the target.'),

  new RouteItem(BotAutoControlPage, 'Bot auto-controls', '/example/bot/auto-controls')
    .setDescription('The movement of the bot at given points. Various actions to reach the last point.'),
]