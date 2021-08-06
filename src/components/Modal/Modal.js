import {useContext, useEffect, useState} from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import style from './Modal.module.css'

const Modal = observer(() => {
  const { root } = useContext(Context)
  const messages = {
    error: {
      title: 'ОШИБКА',
      text: 'Игра не возможна, слишком высокое значение minDestroy',
      smile: null,
    },
    start: {
      title: 'ПРАВИЛА',
      text: `При клике на тайл сжигается область, 
      состоящая из группы прилегающих тайлов того же цвета, 
      размер группы не может быть меньше чем ${root.minDestroy}`,
      smile: null,
    },
    win: {
      title: 'ПОБЕДА',
      text: 'Вы победили!',
      smile: <span>&#129321;</span>,
    },
    lose: {
      title: 'ПРОИГРЫШ',
      text: 'Вы проиграли',
      smile: <span>&#128577;</span>,
    },
    mix: {
      title: 'ПЕРЕМЕШАТЬ',
      text: `У Вас нет ходов, поле будет перешано`,
      smile: <span>&#8635;</span>,
    },
    noMoves: {
      title: 'НЕТ ХОДОВ',
      text: 'У Вас нет ходов, вы проиграли',
      smile: <span>&#128577;</span>,
    },
  }
  const [message, setMessage] = useState({default: null, smile: null})
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    setMessage(messages[root.userStatus])
    setIsActive(true)
  }, [root.userStatus])

  const Smile =  () => message.smile
  const closeHandle = () => {
    setIsActive(false)
    if(root.userStatus !== 'mix') {
      root.resetAll()
    }
    if(root.userStatus === 'mix') {
      setTimeout(() => {
        root.tile.listCorrector('noMoves')
        root.setMixCount()
      }, 150)
      
    }
  }
  return (
    <div 
      className={isActive ? `${style.modal} ${style.active}` : style.modal} 
      onClick={closeHandle}
    >
      <div 
        className={style.content}
        onClick={e => e.stopPropagation()}
      > 
      <h2
        className={style.title}
      >
        {message.title}
      </h2>
      <span
        className={style.close}
        onClick={closeHandle}
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
