
import Points from './Points/Points'
import Moves from './Moves/Moves'
import Progress from './Progress/Progress'
import styles from './ProgressBar.module.css'

const ProgressBar = () => {
  return (
    <div 
      className={styles.wrap} 
    >
      <Moves/>
      <Points/>
      <Progress/>
    </div>
  )
}
export default ProgressBar