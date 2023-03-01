import React from 'react'
import Cell from './Cell'

const Grid = ({ grid, handleClick }) => {
  return (
    <div>
      <div
        css={{
          backgroundColor: '#00FF41',
          display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
          marginTop: '3rem',
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              onClick={() => {
                handleClick(colIdx, rowIdx)
              }}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Grid
