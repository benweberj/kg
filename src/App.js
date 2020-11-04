import React, { useState, useEffect } from 'react'
// import MolViewer from './MolViewer'
import Graph from 'react-graph-vis'
import options from './options'
import graphData from './graphData'

const NODE_MAP = {
  'drug': { color: '#9349e3' }, 
  'compound': { link: 'drug' },
  'pathway': { color: '#e08560' },
  'disease': { color: '#e34949' },
  // 'gene': { color: '#ffffff', shape: 'circle' },
  'gene': { color: '#ffffff', text: '#000' },
  'sideeffect': { color: '#b8de6f' },
  'symptom': { color: '#ffe05d' },
  'anatomy': { link: 'tissue' },
  'tissue': { color: '#0278ae' }
}

const formatGraph = output => {
  if (!output) return null
  const { nodes, edges } = output
  const _extractTypeFromTitle = title => title.toLowerCase().match(/\(.+\)$/gm)
  const _pushUpdatedNode = node => {
    // Determine node type
    let type = node.type?.toLowerCase() || _extractTypeFromTitle(node.title)
    if (!type || !(type in NODE_MAP)) {
      // Skip a node without a recognizable type.
      console.log('app/drugs/net', 'skipping node with unknown type', node)
      return { ...node, color: { background: '#000' }, type: 'other' }
    }
    // Get entry and (possibly) resolve link
    let mapEntry = NODE_MAP[type]
    if ('link' in mapEntry) {
      type = mapEntry.link
      mapEntry = NODE_MAP[type]
    }
    const { color, shape = 'dot' } = mapEntry
    // Determine node name 
    const label = node.properties?.name || 'UNKNOWN'
    // TODO:  Remove this demo hack.
    const colorStyle = (label === 'CHIA') ? { background: 'gray' } : { background: color } 
    return { 
      ...node, 
      color: colorStyle, 
      shape, 
      type, 
      label,
      title: label,
    }
  }
  const styledNodes = nodes.map(_pushUpdatedNode)
  return addNeighbors(styledNodes, edges)
}

const addNeighbors = (nodes, edges) => {
  const lookup = {}
  nodes.forEach(node => lookup[node.id] = node) 
  const relatedNodes = []
  nodes.forEach(node => {
    const neighbors = []
    edges.forEach(e => {
      if (node.id === e.from) {
        neighbors.push({ ...lookup[e.to], rel: 'outgoing' })
      } else if (node.id === e.to) {
        neighbors.push({ ...lookup[e.from], rel: 'incoming' })
      }
    })
    relatedNodes.push({ ...node, neighbors, size: Math.min(20 + (neighbors.length*3), 60), label: `--${neighbors.length}--` })
  })
  return { nodes: relatedNodes, edges }
}


function App() {
  const [data, setData] = useState(formatGraph(graphData))
  const [stabilized, setStab] = useState(false)

  // useEffect(_ => {
  //   setTimeout(_ => {
  //     setStab(true)
  //   }, 20000)
  // }, [])

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <Graph 
        graph={data}
        options={stabilized ? {...options, physics: { enabled: false }} : options}
        events={{}}
      />
    </div>
  )
}

export default App
