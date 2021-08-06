import { useContext } from 'react'
import { Context } from '../../../index'
import { observer } from 'mobx-react-lite'
import styles from './Points.module.css'

const Points = observer(() => {
  const { root } = useContext(Context)

  return (
    <div 
      className={styles.wrap} 
    >
      <span className={styles.label}>
        ОЧКИ
      </span>
      {root.points}
    </div>
  )
})

export default Points