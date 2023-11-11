import { useState } from 'react';
import './GameBoard.css';

const GameBoard = () => {
  const initialBoardState = Array(3).fill(null).map(() => Array(3).fill(null));
  const [board, setBoard] = useState(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const handleCellClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] !== null) {
      return;
    }

    // Set the cell to the current player's symbol
    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? currentPlayer : cell));

    setBoard(updatedBoard);

    // Switch the player
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
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
