import React from 'react'
import Grid from '../components/Grid'

const clone = x => JSON.parse(JSON.stringify(x))

function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper))
}

const newTicTacToeGrid = () =>
  generateGrid(3, 3, () => null)

function checkThree(a, b, c) {
  if (!a || !b || !c) return false
  return a === b && b === c
}

const flatten = arr =>
  arr.reduce((acc, cur) => [...acc, ...cur], [])

function checkForWin(flatGrid) {
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid

  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  )
}

function checkForDraw(flatGrid) {
  return (
    !checkForWin(flatGrid) &&
    flatGrid.filter(Boolean).length ===
      flatGrid.length
  )
}

const NEXT_TURN = {
  O: 'X',
  X: 'O',
}

const getInitialState = () => ({
  grid: newTicTacToeGrid(),
  status: 'inProgress',
  turn: 'X',
})

const reducer = (state, action) => {
  if (
    state.status === 'success' &&
    action.type !== 'RESET'
  ) {
    return state
  }

  switch (action.type) {
    case 'RESET':
      return getInitialState()
    case 'CLICK': {
      const { x, y } = action.payload
      const { grid, turn } = state

      if (grid[y][x]) {
        return state
      }

      const nextState = clone(state)

      nextState.grid[y][x] = turn

      const flatGrid = flatten(nextState.grid)

      if (checkForWin(flatGrid)) {
        nextState.status = 'success'
        return nextState
      }

      if (checkForDraw(flatGrid)) {
        return getInitialState()
      }

      nextState.turn = NEXT_TURN[turn]

      return nextState
    }

    default:
      return state
  }
}

const Game = () => {
  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState()
  )
  const { grid, status, turn } = state

  const handleClick = (x, y) => {
    dispatch({ type: 'CLICK', payload: { x, y } })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '90%',
        marginTop: '5rem',
      }}
    >
      <div>
        <p
          css={{
            color: '#fff',
          }}
        >
          {status === 'success'
            ? null
            : `Siguiente turno: ${turn}`}
        </p>
        <p
          css={{
            color: '#fff',
            marginLeft: '2rem',
          }}
        >
          {status === 'success'
            ? `${turn} gano!`
            : null}
        </p>
      </div>
      <Grid
        grid={grid}
        handleClick={handleClick}
      />
    </div>
  )
}

export default Game
