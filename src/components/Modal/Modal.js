import {useContext, useEffect, useState} from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import style from './Modal.module.css'
import tile from '../../assets/main/blocks/red.png'

const Modal = observer(() => {
  const { root } = useContext(Context)
  const messages = {
    start: {
      text: `При клике на тайл сжигается область, 
      состоящая из группы прилегающих тайлов того же цвета, 
      размер группы не может быть меньше чем ${root.minDestroy}`,
      smile: <img src={tile} width="40" height="40"/>,
    },
    win: {
      text: 'Вы победили!',
      smile: <span>&#129321;</span>,
    },
    lose: {
      text: 'Вы проиграли',
      smile: <span>&#128577;</span>,
    },
    noMoves: {
      text: 'У Вас нет ходов, поле будет перешано',
      smile: <span>&#8635;</span>,
    }

    
  }
  const [message, setMessage] = useState({default: 'text',smile: <span>&#128577;</span>})
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    setMessage(messages[root.userStatus])
    setIsActive(true)
  }, [root.userStatus])

  const Smile =  () => message.smile

  return (
    <div 
      className={isActive ? `${style.modal} ${style.active}` : style.modal} 
      onClick={() => {
        setIsActive(false)
        if(root.userStatus === 'win' || root.userStatus === 'lose') {
          root.resetAll()
        }
      }}
    >
      <div 
        className={style.content}
        onClick={e => e.stopPropagation()}
      > 
      <span
        className={style.close}
        onClick={() => {
          setIsActive(false)
          if(root.userStatus === 'win' || root.userStatus === 'lose') {
            root.resetAll()
          }
        }}
      >
       &#10006;
      </span>
        {message.text}
        <Smile/>
      </div>
    </div>
  )
})

export default Modal
