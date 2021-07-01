import { useState } from 'react'
import styles from './Tile.module.css'

const Tile = (props) => {
  const { color, adress } = props
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