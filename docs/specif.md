# Specification Document: 5x5 Tic-Tac-Toe Game

## Introduction

This document specifies a 5x5 Tic-Tac-Toe game designed for a single user to play against a computer. The game involves a user and a computer alternately placing marks on a 5x5 grid, with the objective to align five of one's own marks in a row, column, or diagonal.

## Game Rules

1. The game board consists of a 5x5 grid.
2. Players alternate turns to place a mark on the board.
3. The player who first aligns five of their marks in a row, column, or diagonal wins the game.
4. If all squares are filled without any player achieving a winning line, the game ends in a draw.

## User Interface

- Game board display with a 5x5 grid.
- Player's marks: X
- Computer's marks: O
- Placing a mark by clicking on an empty square on the game board.
- Notification of victory or draw at the end of the game.

## Technologies

- Programming Language: JavaScript
- User Interface: HTML/CSS with interactive elements managed by JavaScript
- Computer Intelligence: An algorithm for evaluating optimal moves

## Implemented Algorithms and Data Structures

- Evaluation of winning conditions using array manipulation.
- Minimax algorithm with alpha-beta pruning for decision-making.
- Use of 2D arrays to represent the game board state.

## Problem Solved & Reason for Algorithm/Data Structure Choice

- The primary problem is creating an intelligent opponent for the player. The minimax algorithm with alpha-beta pruning is chosen for its effectiveness in zero-sum games like Tic-Tac-Toe, where it can predict the outcome of different moves.
- This algorithm, combined with a suitable data structure (2D arrays), efficiently manages the game state and decision-making process.

## Inputs and Usage

- The program accepts mouse clicks as input to place marks on the game board.
- The game board's state is updated accordingly and used to evaluate the game's status.

## Time and Space Complexity Goals

- The goal is to implement the game logic to run in acceptable time complexity, ideally with a time complexity of O(n^2) for evaluating the board state, where `n` is the number of squares.
- Space complexity should be minimized, with the primary storage being the 2D array representing the board, which has a space complexity of O(n^2).

## Academic Program

- This project is part of the Bachelor’s in Computer Science (BSc) curriculum.

## Language of the Project Documentation

- The language used in this project documentation is English.
- The code, comments, and documentation text for the project will be consistent in using English to facilitate peer reviews and code inspections.
