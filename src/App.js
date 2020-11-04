import React, { useState, useEffect, useRef } from 'react'
import ForceGraph3d from 'react-force-graph-3d'
import g from './graphData'

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

let nodes = []
let links = []
let gr = formatGraph(g)
for (let node of gr.nodes) {
  nodes.push({ id: node.id, name: node.title, value: node.label, color: node.color.background })
}
for (let edge of gr.edges) {
  links.push({ source: edge.from, target: edge.to })
}
const graph = { nodes, links }

// const graph = {
//   nodes: [
//     { id: 'id1', name: 'Node 1', val: Math.random().toFixed(3) },
//     { id: 'id2', name: 'Node 2', val: Math.random().toFixed(3) },
//     { id: 'id3', name: 'Node 3', val: Math.random().toFixed(3) },
//     { id: 'id4', name: 'Node 4', val: Math.random().toFixed(3) },
//     { id: 'id5', name: 'Node 5', val: Math.random().toFixed(3) },
//     { id: 'id6', name: 'Node 6', val: Math.random().toFixed(3) },
//   ],
//   links: [
//     { source: 'id1', target: 'id2' },
//     { source: 'id1', target: 'id5' },
//     { source: 'id1', target: 'id6' },
//     { source: 'id4', target: 'id3' },
//     { source: 'id2', target: 'id4' },
//     { source: 'id2', target: 'id5' },
//     { source: 'id5', target: 'id3' },
//   ]
// }

function App() {
  const graphRef = useRef()

  useEffect(_ => {
  }, [])

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <ForceGraph3d 
        graphData={graph}
        backgroundColor='#0000'
        nodeColor='color'
        // linkCurvature={.3}
        // linkDirectionalParticles={5}
      />
    </div>
  )
}

export default App
