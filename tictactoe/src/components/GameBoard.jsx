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
    

        const updatedBoard = board.map((row, rIdx) =>
            row.map((cell, cIdx) =>
                rIdx == rowIndex && cIdx === colIndex ? currentPlayer : cell));

        setBoard(updatedBoard);

        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    return (
        <div className="game-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map((cell, colIndex) => (
                        <button 
                            key={`${rowIndex}-${colIndex}`} 
                            className="cell" 
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
