import { useContext } from 'react'
import { Context } from '../../index'
import styles from './Mix.module.css'

const Mix = () => {
  const { root } = useContext(Context)
  return (
    <>
      <button
        className={styles.button} 
        onClick={() => root.field.mix()}
      >
        Перемешать
      </button>
      <button
        className={styles.button} 
        onClick={() => root.field.chess()}
      >
        Шахматы
      </button>
    </>
  )
}
export default Mix