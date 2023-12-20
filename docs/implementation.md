# Implementation documentation

## Main components

- GameBoard: Manages the state of the game board and renders the UI for the game.
- GameHeuristics: Contains logic to evaluate the game board for wins, losses, and draws.
- AI Logic: Implements the Minimax algorithm to determine the best moves for the AI player.

## Time and space complexity

- The time complexity of the Minimax algorithm is exponential in relation to the number of moves looked ahead. The base of the exponent is the number of possible moves at each step.
- Space complexity primarily depends on the depth of the recursion and the size of the game board.
- Alpha-beta pruning helps to cut down on the number of nodes evaluated by the Minimax algorithm, significantly improving its time efficiency.
- Since Minimax is a brute force algorithm, the time complexity for this is O(2^n).
- Alpha-beta pruning will in the worst case (where the tree is examined fully) not improve time complexity at all. In the best case it makes minimax much more efficient.

## Possible improvements

- Already evaluated branches and games could be stored so there wouldn't be need to calculate them again after each move.
- Possibly evaluation heuristics could be improved to make them more efficient, since they're being run in each branch.

## Usage of LLM (Large language models)

- ChatGPT-4 was used to help create this project, mainly to debug errors and to help in writing test cases
