import { Math as _Math } from 'three'

export const TEAM_RED = 'red'
export const TEAM_BLUE = 'blue'

export const map = {
  type: 'square',
  name: 'map 5*5',
  planeSize: 1000,
  pointSize: 10,
  teams: [
    {
      name: TEAM_RED,
      color: '#FF0000'
    },
    {
      name: TEAM_BLUE,
      color: '#0000FF'
    },
  ],
  bases: {
    [TEAM_RED]: {
      type: 'base',
      name: 'Base',
      position: {"x": -425, "y": 1, "z": -425},
      rotation: {"x": 0, "y": _Math.degToRad(225), "z": 0},
    },
    [TEAM_BLUE]: {
      type: 'base',
      name: 'Base',
      position: {"x": 425, "y": 1, "z": 425},
      rotation: {"x": 0, "y": _Math.degToRad(45), "z": 0},
    },
  },
  towers: {
    [TEAM_RED]: [
      {
        type: 'tower',
        name: 'Tower mid 1',
        position: {"x": -275, "y": 1, "z": -275},
      },
      {
        type: 'tower',
        name: 'Tower mid 2',
        position: {"x": -95, "y": 1, "z": -95},
      },
      {
        type: 'tower',
        name: 'Tower bot 1',
        position: {"x": -445, "y": 1, "z": -175},
      },
      {
        type: 'tower',
        name: 'Tower bot 2',
        position: {"x": -445, "y": 1, "z": 215},
      },
      {
        type: 'tower',
        name: 'Tower top 1',
        position: {"x": -175, "y": 1, "z": -445},
      },
      {
        type: 'tower',
        name: 'Tower top 2',
        position: {"x": 215, "y": 1, "z": -445},
      },
    ],
    [TEAM_BLUE]: [
      {
        type: 'tower',
        name: 'Tower mid 1',
        position: {"x": 275, "y": 1, "z": 275},
      },
      {
        type: 'tower',
        name: 'Tower mid 2',
        position: {"x": 95, "y": 1, "z": 95},
      },
      {
        type: 'tower',
        name: 'Tower bot 1',
        position: {"x": 445, "y": 1, "z": 175},
      },
      {
        type: 'tower',
        name: 'Tower bot 2',
        position: {"x": 445, "y": 1, "z": -215},
      },
      {
        type: 'tower',
        name: 'Tower top 1',
        position: {"x": 175, "y": 1, "z": 445},
      },
      {
        type: 'tower',
        name: 'Tower top 2',
        position: {"x": -215, "y": 1, "z": 445},
      },
    ],
  },
  roads: [
    {
      name: 'mid',
      color: '#FFDD00',
      points: [
        {"x":405,"y":1,"z":405},
        {"x":345,"y":1,"z":345},

        {"x":-345,"y":1,"z":-345},
        {"x":-405,"y":1,"z":-405},
      ]
    },
    {
      name: 'top',
      color: '#FF0000',
      points: [
        {"x":395,"y":1,"z":445},
        {"x":-395,"y":1,"z":445},
        {"x":-445,"y":1,"z":395},
        {"x":-445,"y":1,"z":-395},
      ]
    },
    {
      name: 'bot',
      color: '#0000FF',
      points: [
        {"x":445,"y":1,"z":395},
        {"x":445,"y":1,"z":-395},
        {"x":395,"y":1,"z":-445},
        {"x":-395,"y":1,"z":-445},
      ]
    }
  ],
}