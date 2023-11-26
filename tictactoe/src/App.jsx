import { useState } from 'react';
import GameBoard from './components/GameBoard';
import { GameOver } from './components/GameOver';
import { GameState } from './components/GameState';

function App() {
  const [gameState, setGameState] = useState(GameState.inProgress);

  return (
    <div className="App">
      <header className="App-header">
        <GameOver gameState={gameState} />
        <GameBoard gameState={gameState} setGameState={setGameState} />
      </header>
    </div>
  );
}

export default App;
