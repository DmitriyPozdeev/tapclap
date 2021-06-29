import { useState } from 'react'

const Tile = () => {
  const tile = {
    color: 'red',
    place: 'random',
    id: 0,
    neighbors: [1, 5],
    fn: () => {
      
    }
  }
  return (
    <div 
    style={{width: 50, height: 50, backgroundColor: 'red'}}
    onClick={() => alert(1)}
    >
     
    </div>
  )
}

export default Tile