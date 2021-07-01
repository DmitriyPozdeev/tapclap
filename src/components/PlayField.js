import { useState, useEffect, useContext } from 'react'
import { Context } from '../index.js'
import Tile from './Tile'
import styles from './PlayField.module.css'

const PlayField = () => {
  const { root } = useContext(Context)
  const {field} = root.playFieldStore
  const { tilesList } = root.tileStore

  useEffect(() => {
    console.log( tilesList )
    console.log( field )
    

  },[field])
  root.initField()
  root.initTilesList()

  return (
    <div 
      className={styles.field}
      onClick={(e) => console.log(e.target.id)}
    >
      {
        tilesList.map((tile, index) => {
          return <Tile 
          color={tile.color} 
          address={tile.address}
          id={index}
          />
        })
      }
    <button
        onClick={root.delete(2)}
      >
        Перемешать
      </button>  
    </div>
   
  )
}

export default PlayField