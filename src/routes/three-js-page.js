import RouteItem from './RouteItem'
import GroundPage from './../pages/ExamplesPage/pages/GroundPage'
import TowerPage from './../pages/ExamplesPage/pages/TowerPage'
import OutlinePage from './../pages/ExamplesPage/pages/OutlinePage'
import SteeringPage from './../pages/ExamplesPage/pages/SteeringPage'
import BotUserControlPage from './../pages/ExamplesPage/pages/BotUserControlPage'
import BotAutoControlPage from './../pages/ExamplesPage/pages/BotAutoControlPage'
import BotAnimationPage from './../pages/ExamplesPage/pages/BotAnimationPage'
import EnvironmentPage from './../pages/ExamplesPage/pages/EnvironmentPage'

export const routes = [
  new RouteItem(GroundPage, 'Плоскость', '/example/ground')
    .setDescription('Получение позиции клика мыши.'),

  new RouteItem(TowerPage, 'Башня', '/example/tower')
    .setDescription('Анимация, стрельба, звуковые эффекты.'),

  new RouteItem(OutlinePage, 'Контур', '/example/outline')
    .setDescription('Получение контура объекта.'),

  new RouteItem(BotAnimationPage, 'Анимация', '/example/bot/animations')
    .setDescription('Управление анимацией бота.'),

  new RouteItem(BotUserControlPage, 'Управление', '/example/bot/user-controls')
    .setDescription('Бот следует в сторону клика мыши. Атакует цель.'),

  new RouteItem(BotAutoControlPage, 'Движение бота', '/example/bot/auto-controls')
    .setDescription('Бот следует по точкам. Различные действия после достижения последней точки.'),

  new RouteItem(SteeringPage, 'Движение ботов', '/example/steering')
    .setDescription('Боты ходят по цсене. При встрече препятствия стараются обойти либо пропустить.'),

  new RouteItem(EnvironmentPage, 'Окружающая среда', '/example/ocean')
    .setDescription('Вода. Земля. Небо.'),
]