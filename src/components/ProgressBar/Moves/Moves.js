import { useContext } from 'react'
import { Context } from '../../../index' 
import { observer } from 'mobx-react-lite'
import styles from './Moves.module.css'

const Points = observer(() => {
  const { root } = useContext(Context)
  return (
    <div 
      className={styles.wrap} 
    >
      <span className={styles.label}>
        ХОДЫ
      </span>
      {root.moves}
    </div>
  )
}) 

export default Points