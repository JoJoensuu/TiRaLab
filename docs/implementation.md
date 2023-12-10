# Specification documentation

## Main components

- GameBoard: Manages the state of the game board and renders the UI for the game.
- GameHeuristics: Contains logic to evaluate the game board for wins, losses, and draws.
- AI Logic: Implements the Minimax algorithm to determine the best moves for the AI player.

## Time and space complexity

- The time complexity of the Minimax algorithm is exponential in relation to the number of moves looked ahead. The base of the exponent is the number of possible moves at each step.
- Space complexity primarily depends on the depth of the recursion and the size of the game board.
- Alpha-beta pruning helps to cut down on the number of nodes evaluated by the Minimax algorithm, significantly improving its time efficiency.
