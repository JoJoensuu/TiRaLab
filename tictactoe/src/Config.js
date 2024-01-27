export const PLAYER = 'O';
export const AI = 'X';
export const STARTING_PLAYER = AI;

export const scores = {
  WIN_SCORE: 10,
  LOSE_SCORE: -10,
  DRAW_SCORE: 0,
};

export const params = {
  MIN_SCORE: -10,
  MAX_SCORE: 10,
  MAX_DEPTH: 5,
  GRID_SIZE: 20,
  WINNING_STRAIGHT: 5,
  ALPHA: -10,
  BETA: 10,
};
