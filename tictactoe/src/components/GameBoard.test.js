import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import GameBoard from './GameBoard'

describe('GameBoard component', () => {

  test('render GameBoard component on screen', () => {
    render(<GameBoard />)
    expect(screen.getByTestId('gameboard')).toBeInTheDocument()
  })
})