import { useContext } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite'
import styles from './Points.module.css'

const Points = observer(() => {
  const { root } = useContext(Context)

  return (
    <span 
      className={styles.wrap} 
    >
      {root.points}
    </span>
  )
})

export default Points