import { useState, useEffect } from 'react';
import './GameBoard.css';
import { checkForWin } from '../logic/GameHeuristics';
import { selectCell } from '../logic/AI';

const GameBoard = () => {
  const initialBoardState = Array(20).fill(null).map(() => Array(20).fill(null));
  const [board, setBoard] = useState(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  useEffect(() => {
    // Check if it's AI's turn
    if (currentPlayer === 'O') {
      makeAIMove(board);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, board]);

  const resetBoard = () => {
    setBoard(initialBoardState);
    setCurrentPlayer('X');
  };

  const makeAIMove = (boardStateAfterHuman) => {
    const availableCells = [];
    boardStateAfterHuman.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          availableCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (availableCells.length === 0) {
      // No available cells, so no move can be made
      return;
    }

    const randomCell = selectCell(availableCells);

    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === randomCell.rowIndex && cIdx === randomCell.colIndex ? 'O' : cell));

    setBoard(updatedBoard);
    // Check for a win after AI move
    if (checkForWin(updatedBoard, randomCell.rowIndex, randomCell.colIndex)) {
      setTimeout(() => {
        alert('AI wins!');
        resetBoard();
      }, 100);
    } else {
      setCurrentPlayer('X'); // Switch back to the human player
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] !== null || currentPlayer !== 'X') {
      return; // Ignore click if cell is already taken or it's not the human player's turn
    }
    if (board[rowIndex][colIndex] !== null) {
      return;
    }

    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? currentPlayer : cell));
    setBoard(updatedBoard);

    // Check for a win using updatedBoard
    setTimeout(() => {
      if (checkForWin(updatedBoard, rowIndex, colIndex)) {
        alert(`Player ${currentPlayer} wins!`);
        resetBoard();
        // Handle win
      } else {
        setCurrentPlayer('O');
      }
    }, 100);
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
