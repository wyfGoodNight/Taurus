import './App.css';
import Graph from './components/graph';
import Title from './components/title';
import ControlBoard from './components/console';

function App() {
  return (
    <div className="App" style={{background:"rgb(245,247,249)"}}>
      <Title/>
      <div className='container'>
        <ControlBoard/>
        <Graph/> 
      </div>
    </div>
  );
}

export default App;
