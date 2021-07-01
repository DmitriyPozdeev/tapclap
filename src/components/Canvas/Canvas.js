import { useState, useRef } from 'react'
import styles from './Canvas.module.css'

const Canvas = () => {
  const canvasRef = useRef(null);
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d');
  ctx.fillRect(0,0, 100, 100);
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