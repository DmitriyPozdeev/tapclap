import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './ProgressBar.module.css'

const RemainingPoints = observer(() => {
  const { root } = useContext(Context)
 
  return (
    <div 
      className={styles.item} 
    >
      <span>
        ОСТАЛОСЬ
      </span>
      {root.ui.remaining}
    </div>
  )
})

export default RemainingPoints
