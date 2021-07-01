import { useState,  useRef, useEffect, useContext } from 'react'
import { Context } from '../../index'
import styles from './Canvas.module.css'

const Canvas = (props) => {
  const { root } = useContext(Context)
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    root.start(context)  
  }, [root])
  
  return (
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        className={styles.field}
        width={544} 
        height={605}>
      </canvas>
    </div>
  )
}

export default Canvas