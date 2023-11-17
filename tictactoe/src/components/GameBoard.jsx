import { useState } from 'react';
import './GameBoard.css';
import { checkForWin } from '../logic/GameHeuristics';

const GameBoard = () => {
  const initialBoardState = Array(20).fill(null).map(() => Array(20).fill(null));
  const [board, setBoard] = useState(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const resetBoard = () => {
    setBoard(initialBoardState);
    setCurrentPlayer('X');
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] !== null) {
      return;
    }

    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? currentPlayer : cell));
    setBoard(updatedBoard);

    // Check for a win using updatedBoard
    if (checkForWin(updatedBoard, rowIndex, colIndex)) {
      alert(`Player ${currentPlayer} wins!`);
      resetBoard();
      // Handle win
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div className="game-board" data-testid="gameboard">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              data-testid={`cell-${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}>
              {cell}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
