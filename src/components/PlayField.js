import { useState } from 'react'

const PlayField = () => {
  const props = {
    size: [5, 4],
    tails: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
    emptyPlaces: [
      [
        { 
          color: 'red'
        },
        { 
          color: 'green'
        },
        { 
          color: 'green'
        },
        { 
          color: 'blue'
        }
      ],
      [{},{},{},{}],
      [{},{},{},{}],
      [{},{},{},{}],
    ]
  }
  return (
    <div style={{width: 550, height: 570, backgroundColor: 'grey', border: 'solid black 1px'}}>
     
    </div>
  )
}

export default PlayField