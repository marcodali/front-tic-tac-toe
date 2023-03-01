import React from 'react'

const Cell = ({ onClick, value }) => {
  return (
    <div
      css={{
        backgroundColor: '#000',
        width: 100,
        height: 100,
      }}
    >
      <button
        css={{
          fontSize: '2.5rem',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          border: 'none',
          color: '#00FF41',
        }}
        onClick={onClick}
        type="button"
      >
        {value}
      </button>
    </div>
  )
}

export default Cell
