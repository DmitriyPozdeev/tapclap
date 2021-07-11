import './App.css';
import Canvas from './components/Canvas/Canvas';
import Points from './components/Points/Points'
import {useContext} from 'react'
import {Context} from './index.js'

function App() {
  const {root} = useContext(Context)
  return (
    <>
      <Canvas/>
      <button
        onClick={() => root.field.mixTiles()}
      >
        Перемешать
      </button>
      <Points/>
    </>
  );
}

export default App;
