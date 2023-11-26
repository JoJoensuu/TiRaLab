import { GameState } from './GameState';

export const Reset = ({ gameState, onReset }) => {
  return (
    <button onClick={onReset} className="reset-button">
    Reset
    </button>
  );
};