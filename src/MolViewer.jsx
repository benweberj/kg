import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'

const localStyles = theme => ({
  viewer: {
    '& .msp-plugin': { background: 'transparent !important' },
    '& .msp-plugin .msp-viewport': { background: 'transparent' },
    '& .msp-plugin .msp-layout-standard': { border: 'none' },
    '& canvas': {
      width: 'inherit !important',
      height: 'inherit !important',
      background: 'transparent !important',
    }
  }
})

let viewerInstance = new PDBeMolstarPlugin()

const MolViewer = props => {
  const { w=200, h=200, classes } = props
  const [protein, setProtein] = useState('6vxx')

  renderProtein = _ => {
    let options = { moleculeId: protein, hideControls: true, viewportBackground: '#ffffff00' }
    let viewerContainer = document.getElementById('litemol-viewer')
    if (viewerContainer) viewerInstance.render(viewerContainer, options)
  }
  
  useEffect(_ => {
    setTimeout(_ => renderProtein(), 0)
  }, [])
  
  // these styles are assuming the protein is being rendered fullscreen in a daydream
  

  return (
    <>
      <div style={{ border: '1px solid red', marginTop: 100 }} className={classes.viewer} id='litemol-viewer' />
    </>
  )
}
 
export default withStyles(localStyles)(MolViewer)