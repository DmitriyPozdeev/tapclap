import { useRef, useEffect, useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './Canvas.module.css'

const Canvas = observer(() => {
  const { root } = useContext(Context)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    root.game.start({canvas, context})
  }, [root.game])

  return ( 
    <div 
      className={styles.wrap} 
      style={{
        width: root.ui.fieldSize.width + 14,
        height: root.ui.fieldSize.height + 14,
        cursor: root.field.isAnimate ? 'wait' : 'pointer'
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.field}
        width={root.ui.fieldSize.width}  
        height={root.ui.fieldSize.height}
        onClick={(e) => root.field.click(e)}
      > 
      </canvas>
    </div>
  )
})

export default Canvas