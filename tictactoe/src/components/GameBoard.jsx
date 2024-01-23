import { useState, useEffect } from 'react';
import './GameBoard.css';
import { checkForWin } from '../logic/GameHeuristics';
import { GameState } from './GameState';
import { PLAYER, AI, params, STARTING_PLAYER } from '../Config';
import { Reset } from './Reset';
import { selectBestMove } from '../logic/AI';
import { getAvailableCells, updateAvailableCells } from '../helpers/HelperFunctions';

const GameBoard = ( { gameState, setGameState }) => {
  // State for the game board and current player
  const [board, setBoard] = useState(Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null)));
  const [moveOptions, setMoveOptions] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(STARTING_PLAYER);

  // Effect hook for handling AI's turn
  useEffect(() => {
    if (currentPlayer === AI && gameState === GameState.inProgress) {
      let aiMove;
      if (moveOptions.length <= 0) {
        aiMove = { rowIndex: 9, colIndex: 9 };
      } else {
        aiMove = selectBestMove(board, moveOptions);
      }
      // Determine the best move for AI
      if (aiMove) {
        // Update the board with AI's move
        const newBoard = board.map((row, rIdx) =>
          row.map((cell, cIdx) => (rIdx === aiMove.rowIndex && cIdx === aiMove.colIndex ? AI : cell))
        );
        setBoard(newBoard);

        // Check for a win or change in game state after AI's move
        const newGameState = checkForWin(newBoard, aiMove);
        setGameState(newGameState);

        if (moveOptions.length <= 0) {
          const newMoveOptions = getAvailableCells(newBoard);
          setMoveOptions(newMoveOptions);
        } else {
          const newMoveOptions = updateAvailableCells(moveOptions, aiMove, newBoard);
          setMoveOptions(newMoveOptions);
        }

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

    let playerMove = { rowIndex: rowIndex, colIndex: colIndex };

    // Check for a win or change in game state after PLAYER's move
    const newGameState = checkForWin(newBoard, playerMove);
    setGameState(newGameState);


    if (moveOptions.length <= 0) {
      const newMoveOptions = getAvailableCells(newBoard);
      setMoveOptions(newMoveOptions);
    } else {
      const newMoveOptions = updateAvailableCells(moveOptions, playerMove, newBoard);
      setMoveOptions(newMoveOptions);
    }

    // Change turn to AI
    currentPlayer === PLAYER ? setCurrentPlayer(AI) : setCurrentPlayer(PLAYER);
  };

  // Function to handle game reset
  const handleReset = () => {
    // Reset the game state, board, and current player
    setGameState(GameState.inProgress);
    setMoveOptions([]);
    setBoard(Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null)));
    setCurrentPlayer(STARTING_PLAYER);
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
