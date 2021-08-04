import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './Mix.module.css'

const Mix = observer(() => {
  const { root } = useContext(Context)
  return (
    <>
      <button
        className={styles.button} 
        disabled={root.mixCount === 0 ? true : false}
        onClick={() => root.field.mix()}
      >
        Перемешать
      </button>
    </>
  )
})
export default Mix