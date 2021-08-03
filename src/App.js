import './App.css';
import Canvas from './components/Canvas/Canvas'
import Points from './components/Points/Points'
import Moves from './components/Moves/Moves'
import ProgressBar from './components/ProgressBar/ProgressBar'
import Mixes from './components/Mixes/Mixes';
import Mix from './components/Mix/Mix';

function App() {
  return (
    <>
      <ProgressBar/>
      <div className="row">
        <Canvas/>
        <Points/>
        <Moves/>
        <Mixes/>
        <Mix/>
      </div>
      
    </>
  );
}

export default App;
