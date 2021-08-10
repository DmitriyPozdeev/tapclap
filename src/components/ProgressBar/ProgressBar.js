
import Points from './Points'
import Moves from './Moves'
import Progress from './Progress/Progress'
import RemainingPoints from './RemainingPoints'
import styles from './ProgressBar.module.css'

const ProgressBar = () => {
  return (
    <div 
      className={styles.wrap} 
    >
      <Moves/>
      <Points/>
      <Progress/>
      <RemainingPoints/>
    </div>
  )
}
export default ProgressBar