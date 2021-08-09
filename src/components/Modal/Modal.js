import {useContext, useEffect, useState} from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import style from './Modal.module.css'

const Modal = observer(() => {
  const { root } = useContext(Context)
  const messages = {
    process: {
      title: null,
      text: null,
      smile: null,
    },
    error: {
      title: 'ОШИБКА',
      text: 'Игра невозможна, слишком высокое значение _minDestroy',
      smile: null,
    },
    start: {
      title: 'ПРАВИЛА',
      text: `При клике на тайл сжигается область, 
      состоящая из группы прилегающих тайлов того же цвета, 
      размер группы не может быть меньше чем ${root._minDestroy}`,
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
      text: `У Вас нет ходов, 
      поле будет перемешано`,
      smile: <span>&#8635;</span>,
    },
    noMoves: {
      title: 'НЕТ ХОДОВ',
      text: `У Вас нет ходов, 
      вы проиграли`,
      smile: <span>&#128577;</span>,
    },
  }
  const [message, setMessage] = useState({default: null, smile: null})
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    setMessage(messages[root._userStatus])
    if(root._userStatus !== 'process') {
      setIsActive(true)
    }
  }, [root._userStatus])

  const Smile =  () => message.smile

  const closeHandle = () => {
    setIsActive(false)
    if(root._userStatus !== 'mix') {
      root.resetAll()
    }
    else if(root._userStatus === 'mix') {
      setTimeout(() => {
        root.setMixCount()
        root.setUserStatus('process')
        root.tile.listCorrector('noMoves')
      }, 180)
      
    }
  }
  return (
    <div 
      className={isActive ? `${style.modal} ${style.active}` : style.modal} 
      onClick={closeHandle}
    >
      <div 
        style={{width: root.field.style.width - 30}}
        className={style.content}
        onClick={e => e.stopPropagation()}
      > 
      <h2
        className={`${style.title} ${style[root._userStatus]}`}
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
