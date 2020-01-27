
export const map = {
  type: 'square',
  size: {
    planeSize: 1000,
    pointSize: 10,
  },
  builds: [
    {
      type: 'base',
      color: '#FF0000',
      name: 'Red Base',
      position: {"x":-425,"y":0,"z":-425},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower mid 1',
      position: {"x":-275,"y":0,"z":-275},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower mid 2',
      position: {"x":-95,"y":0,"z":-95},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower bot 1',
      position: {"x":-445,"y":0,"z":-175},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower bot 2',
      position: {"x":-445,"y":0,"z":215},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower top 1',
      position: {"x":-175,"y":0,"z":-445},
    },
    {
      type: 'tower',
      color: '#FF0000',
      name: 'Red Tower top 2',
      position: {"x":215,"y":0,"z":-445},
    },
    {
      type: 'base',
      color: '#0000FF',
      name: 'Blue Base',
      position: {"x":425,"y":0,"z":425},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower mid 1',
      position: {"x":275,"y":0,"z":275},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower mid 2',
      position: {"x":95,"y":0,"z":95},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower bot 1',
      position: {"x":445,"y":0,"z":175},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower bot 2',
      position: {"x":445,"y":0,"z":-215},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower top 1',
      position: {"x":175,"y":0,"z":445},
    },
    {
      type: 'tower',
      color: '#0000FF',
      name: 'Blue Tower top 2',
      position: {"x":-215,"y":0,"z":445},
    },
  ],
  roads: [
    {
      name: 'mid',
      color: 0xFFDD00,
      points: [
        {"x":405,"y":0,"z":405},
        {"x":345,"y":0,"z":345},

        {"x":-345,"y":0,"z":-345},
        {"x":-405,"y":0,"z":-405},
      ]
    },
    {
      name: 'top',
      color: '#FF0000',
      points: [
        {"x":395,"y":0,"z":445},
        {"x":-395,"y":0,"z":445},
        {"x":-445,"y":0,"z":395},
        {"x":-445,"y":0,"z":-395},
      ]
    },
    {
      name: 'bot',
      color: '#0000FF',
      points: [
        {"x":445,"y":0,"z":395},
        {"x":445,"y":0,"z":-395},
        {"x":395,"y":0,"z":-445},
        {"x":-395,"y":0,"z":-445},
      ]
    }
  ],
}