import { useRef, useEffect, useContext } from 'react'
import { Context } from '../../index'
import styles from './Canvas.module.css'

const Canvas = () => {
  const { root } = useContext(Context)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    root.start({canvas, context})
  }, [])

  return (
    <div 
      className={styles.wrap} 
      style={{
        width: root.field.style.width + 14,
        height: root.field.style.height + 14,
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.field}
        width={root.field.style.width}  
        height={root.field.style.height}
        onClick={(e) => root.field.click(e)}
      > 
      </canvas>
    </div>
  )
}

export default Canvas