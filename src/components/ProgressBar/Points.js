import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './ProgressBar.module.css'

const Points = observer(() => {
  const { root } = useContext(Context)
 
  return (
    <div 
      className={styles.item} 
    >
      <span>
        ОЧКИ
      </span>
      {root.user.points}
    </div>
  )
})

export default Points