import './App.css';
import Canvas from './components/Canvas/Canvas';
import {useContext} from 'react'
import {Context} from './index.js'

function App() {
  const {root} = useContext(Context)
  return (
    <>
      <Canvas/>
      <button
        onClick={() => root.mixTiles()}
      >
        Перемешать
      </button>
    </>
  );
}

export default App;
