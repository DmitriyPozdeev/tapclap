import './App.css';
import Canvas from './components/Canvas/Canvas'
import ProgressBar from './components/ProgressBar/ProgressBar'
import Mixes from './components/Mixes/Mixes'
import Modal from './components/Modal/Modal'

function App() {
  return (
    <>
      <ProgressBar/>
      <Canvas/>
      <Mixes/>
      <Modal/>
    </>
  );
}

export default App;
