import {useContext, useEffect, useState} from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import style from './Modal.module.css'

const Modal = observer(() => {
  const { root } = useContext(Context)

  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    if(root.user.status !== 'process') {
      setIsActive(true)
    }
  }, [root.user.status])

  const closeHandle = () => {
    setIsActive(false)
    if(root.user.status !== 'mix') {
      root.user.reset()
    }
    else if(root.user.status === 'mix' ) {
      setTimeout(() => {
        root.user.setMixCount()
        root.user.setStatus('process')
        root.tile.listCorrector('noMoves')
      }, 250)
      
    }
  }

  const Smile =  () => root.ui.currentMessage.smile
  
  return (
    <div 
      className={isActive ? `${style.modal} ${style.active}` : style.modal} 
      onClick={closeHandle}
    >
      <div 
        style={{
          width: root.ui.fieldSize.width,
        }}
        className={style.content}
        onClick={e => e.stopPropagation()}
      > 
      <h2
        className={`${style.title} ${style[root.user.status]}`}
      >
        {root.ui.currentMessage.title}
      </h2>
      <span
        className={style.close}
        onClick={closeHandle}
      >
       &#10006;
      </span>
        {root.ui.currentMessage.text}
        <Smile/>
      </div>
    </div>
  )
})

export default Modal
