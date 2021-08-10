import React , { createContext } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import RootStore from './stores/RootStore'

export const Context = createContext(null)
ReactDOM.render(
  <Context.Provider value={{
    root: new RootStore(),
  }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Context.Provider>,
  document.getElementById('root')
)
reportWebVitals()
