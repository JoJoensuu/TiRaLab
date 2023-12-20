import { useState, useEffect } from 'react';
import './GameBoard.css';
import { checkForWin } from '../logic/GameHeuristics';
import { GameState } from './GameState';
import { PLAYER, AI } from '../Config';
import { Reset } from './Reset';
import { selectBestMove } from '../logic/AI';

const GameBoard = ( { gameState, setGameState }) => {
  // State for the game board and current player
  const [board, setBoard] = useState(Array(20).fill(null).map(() => Array(20).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);

  // Effect hook for handling AI's turn
  useEffect(() => {
    if (currentPlayer === AI && gameState === GameState.inProgress) {
      // Determine the best move for AI
      const aiMove = selectBestMove(board);
      if (aiMove) {
        // Update the board with AI's move
        const newBoard = board.map((row, rIdx) =>
          row.map((cell, cIdx) => (rIdx === aiMove.rowIndex && cIdx === aiMove.colIndex ? AI : cell))
        );
        setBoard(newBoard);

        // Check for a win or change in game state after AI's move
        const newGameState = checkForWin(newBoard, aiMove.rowIndex, aiMove.colIndex);
        setGameState(newGameState);

        // Change turn back to PLAYER
        setCurrentPlayer(PLAYER);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, gameState, board]);

  // Function to handle cell clicks (PLAYER's moves)
  const handleCellClick = (rowIndex, colIndex) => {
    // Ignore click if cell is already filled, if it's not PLAYER's turn, or if game is not in progress
    if (board[rowIndex][colIndex] !== null || currentPlayer !== PLAYER || gameState !== GameState.inProgress) {
      return;
    }

    // Update board with PLAYER's move
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    // Check for a win or change in game state after PLAYER's move
    const newGameState = checkForWin(newBoard, rowIndex, colIndex, currentPlayer);
    setGameState(newGameState);

    // Change turn to AI
    currentPlayer === PLAYER ? setCurrentPlayer(AI) : setCurrentPlayer(PLAYER);
  };

  // Function to handle game reset
  const handleReset = () => {
    // Reset the game state, board, and current player
    setGameState(GameState.inProgress);
    setBoard(Array(20).fill(null).map(() => Array(20).fill(null)));
    setCurrentPlayer(PLAYER);
  };

  // Render the game board and reset button
  return (
    <div>
      <Reset gameState={gameState} onReset={handleReset} />
      <div className="game-board" data-testid="gameboard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`}
                data-testid={`cell-${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}>
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>

  );
};

export default GameBoard;
