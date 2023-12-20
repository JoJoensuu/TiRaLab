# Testing

## Coverage

[![codecov](https://codecov.io/gh/JoJoensuu/TiRaLab/graph/badge.svg?token=LKWGX2VQ4Q)](https://codecov.io/gh/JoJoensuu/TiRaLab)

## Unittests

Unittests can be run like so:

```cd tictactoe```

```npm run test```

Unittests have been implemented for all components. The ones testing the AI and the minimax algorithm are in .src/components/GameBoard.test.js, .src/logic/AI.test.js and .src/logic/GameHeuristics.test.js. Since GameBoard component is responsible for running the whole gameboard app, it made sense to test if the AI could win against a very rudimentary strategy. This is done by testing whether the AI will win within a reasonable time (20 seconds) against an opponent who will place their mark on the first available cell.

AI.test.js will test whether the selectBestMove function (which will initiate the minimax) and evaluateGameBoard function (which is performed at the leaf-node of each branch) work as they should. This is done by simulating a specific game state and testing whether the AI will select a correct cell, either to block the player from winning or to advance their own position.

Test run should take well over a minute to perform.

There are no separate performance tests since the unittests already ensure that the AI will outperform a rudimentary strategy in a set time limit and it will select correct cell placement in even more complicated game states.
