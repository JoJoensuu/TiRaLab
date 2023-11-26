import { GameState } from './GameState';

export const GameOver = ({ gameState }) => {
  let message = '';
  switch (gameState) {
  case GameState.playerWins:
    message = 'Player Wins!';
    break;
  case GameState.aiWins:
    message = 'AI Wins!';
    break;
  case GameState.draw:
    message = 'It\'s a Draw!';
    break;
  default:
    message = 'Game in Progress...';
  }

  return <div>{message}</div>;
};