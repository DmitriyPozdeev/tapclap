import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './ProgressBar.module.css'

const ProgressBar = observer(() => {
  const { root } = useContext(Context)

  return (
    <div 
      className={styles.wrap} 
    >
      <div className={styles.progress}>
        <span className={styles.label}>
          ПРОГРЕСС
        </span>
        <div className={styles.allProgress}>
          <div 
            className={styles.completeProgress}
            style={{
              width: root.progress < 100 ? `${root.progress}%` : '100%'
            }}
          ></div>
        </div>
      </div>
    </div>
  )
})

export default ProgressBar