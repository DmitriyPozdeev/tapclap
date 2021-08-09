
import Points from './Points'
import Moves from './Moves'
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