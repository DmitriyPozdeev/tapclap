import { useEffect, useContext } from 'react'
import { Context } from '../../index'
import styles from './ProgressBar.module.css'

const ProgressBar = () => {
  const { root } = useContext(Context)
  useEffect(() => {
  }, [])

  return (
    <div 
      className={styles.wrap} 
    >
      <div className={styles.progress}>
        <span className={styles.label}>
          ПРОГРЕСС
        </span>
        <div className={styles.allProgress}>
          <div className={styles.completeProgress}></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar