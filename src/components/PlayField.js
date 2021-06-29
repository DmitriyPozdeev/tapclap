import { useState } from 'react'

const PlayField = () => {
  const props = {
    size: [5, 4],
    tails: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
    emptyPlaces: [1, 5]
  }
  return (
    <div style={{width: 550, height: 570, backgroundColor: 'grey', border: 'solid black 1px'}}>
     
    </div>
  )
}

export default PlayField