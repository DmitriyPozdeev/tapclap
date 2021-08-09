import { useContext } from 'react'
import { Context } from '../../index' 
import { observer } from 'mobx-react-lite'
import styles from './ProgressBar.module.css'

const Moves = observer(() => {
  const { root } = useContext(Context)
  return (
    <div 
      className={styles.item} 
    >
      <span>
        ХОДЫ
      </span>
      {root.ui.balanceMoves}
    </div>
  )
}) 

export default Moves