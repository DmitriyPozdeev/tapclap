import { useState,  useRef, useEffect, useContext } from 'react'
import { Context } from '../../index'
import styles from './Canvas.module.css'

const Canvas = (props) => {
  const { root } = useContext(Context)
  const { fieldSize } = root
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    root.start(context)  
  }, [root])
  
  return (
    <div className={styles.wrap} styles={{with: fieldSize.width, height: fieldSize.height}}>
      <canvas
        ref={canvasRef}
        className={styles.field}
        width={fieldSize.width} 
        height={fieldSize.height}>
      </canvas>
    </div>
  )
}

export default Canvas