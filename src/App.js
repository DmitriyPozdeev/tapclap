import './App.css';
import PlayField from './components/PlayField';

function App() {
  return (
    <>
      <PlayField/>
      <button
        onClick={() => console.log(1)}
      >
        Перемешать
      </button>
    </>
  );
}

export default App;
