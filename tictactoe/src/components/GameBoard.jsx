import { useState, useEffect } from 'react';
import './GameBoard.css';
import { checkForWin } from '../logic/GameHeuristics';
import { GameState } from './GameState';
import { PLAYER, AI } from '../Config';
import { Reset } from './Reset';
import { selectBestMove } from '../logic/AI';

const GameBoard = ( { gameState, setGameState }) => {
  const [board, setBoard] = useState(Array(20).fill(null).map(() => Array(20).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [lastMove, setLastMove] = useState({ lastRow: null, lastCol: null });

  useEffect(() => {
    if (currentPlayer === AI && gameState === GameState.inProgress) {
      const aiMove = selectBestMove(board, lastMove.lastRow, lastMove.lastCol, PLAYER);
      if (aiMove) {
        const newBoard = board.map((row, rIdx) =>
          row.map((cell, cIdx) => (rIdx === aiMove.rowIndex && cIdx === aiMove.colIndex ? AI : cell))
        );

        setBoard(newBoard);
        const newGameState = checkForWin(newBoard, aiMove.rowIndex, aiMove.colIndex);
        setGameState(newGameState);

        setCurrentPlayer(PLAYER);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, gameState, board]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] !== null || currentPlayer !== PLAYER || gameState !== GameState.inProgress) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    const newGameState = checkForWin(newBoard, rowIndex, colIndex, currentPlayer);
    setGameState(newGameState);

    currentPlayer === PLAYER ? setCurrentPlayer(AI) : setCurrentPlayer(PLAYER);
    setLastMove({ lastRow: rowIndex, lastCol: colIndex });
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setBoard(Array(20).fill(null).map(() => Array(20).fill(null)));
    setCurrentPlayer(PLAYER);
  };

  return (
    <div>
      <Reset gameState={gameState} onReset={handleReset} />
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
    </div>

  );
};

export default GameBoard;
