import { useState } from 'react'

const Tile = () => {
  const props = {
    color: 'red',
    place: 0,
    neighbors: [1, 5]
  }
  return (
    <div style={{width: 50, height: 50, backgroundColor: 'red'}}>
     
    </div>
  )
}

export default Tile