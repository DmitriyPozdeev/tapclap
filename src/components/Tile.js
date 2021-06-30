import { useState } from 'react'
import styles from './Tile.module.css'

const Tile = (props) => {
  const { color, adress } = props
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
      className={`${styles[color]} ${styles.tile}`}
      style={{width: 50, height: 50}}
      onClick={() => console.log(adress, color)}
    >
     {adress}
    </div>
  )
}

export default Tile