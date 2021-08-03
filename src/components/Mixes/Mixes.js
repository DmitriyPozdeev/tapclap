import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './Mixes.module.css'

const Mixes = observer(() => {
  const { root } = useContext(Context)

  return (
    <div 
      className={styles.wrap} 
    >
      <span className={styles.label}>
        Перемешиваний
      </span>
      {root.mixCount}
    </div>
  )
})

export default Mixes