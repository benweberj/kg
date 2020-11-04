export default {
  height: '100%',
  width: '100%',
  autoResize: true,

  layout: {
    hierarchical: false
  },
  nodes: {
    shape: 'box',
    margin: 5,
    mass: 1,
    // mass: 1,
    shapeProperties: {
      borderRadius: 4,
    },
    borderWidth: 0,
    borderWidthSelected: 0,
    font: {
      color: '#fff',
      size: 18,
      face: 'Heebo',
      align: 'center',
    },
    color: {
      background: '#485573',
      highlight: {
        background: '#7c91c2'
      },
      hover: {
        background: '#48557388'
      }
    }
  },
  edges: {
    color: '#5b9bea',
    smooth: {
      type: 'continuous',
    }
  },
  physics: {
    maxVelocity: 20,
    timestep: 1,
    repulsion: {
      nodeDistance: 400,
      // damping: .5,
      // springLength: 100,
    },
    solver: 'repulsion',
    // stabilization: {

    // }
  },
}