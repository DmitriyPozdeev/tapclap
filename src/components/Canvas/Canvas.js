import { useState,  useRef, useEffect, useContext } from 'react'
import { Context } from '../../index'
import styles from './Canvas.module.css'

const Canvas = (props) => {
  const { root } = useContext(Context)
  const { style } = root.field
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    root.start(context)   
  }, [])
  return (
    <div className={styles.wrap} >
      <canvas
        ref={canvasRef}
        className={styles.field}
        width={root.field.style.width}  
        height={root.field.style.height}> 
      </canvas>
    </div>
  )
}

export default Canvas