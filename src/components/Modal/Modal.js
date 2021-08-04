import {useContext} from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import style from './Modal.module.css'

const Modal = observer(() => {
  const { root } = useContext(Context)
  const overText = root.userState === 'win' ? 'Вы победили!' : 'Вы проиграли'
  return (
    <div 
      className={root.isOver ? `${style.modal} ${style.active}` : style.modal} 
      onClick={() => root.resetAll()}
    >
      <div 
        className={style.content}
        onClick={e => e.stopPropagation()}
      > 
      <span
        className={style.close}
        onClick={() => root.resetAll()}
      >
       X
      </span>
        {overText} &#129321;
      </div>
    </div>
  )
})

export default Modal
