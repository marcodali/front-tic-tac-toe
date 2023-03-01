import React, { useState, useEffect } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import Game from './Game'
import Modal from 'react-modal'

const override = {
  borderColor: '#00ff41',
  marginTop: '1rem',
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#00ff41',
    borderRadius: '10px',
    padding: '3rem',
  },
}

Modal.setAppElement('#app')

const socket = io(
  'http://ec2-18-188-166-37.us-east-2.compute.amazonaws.com'
)

const Lobby = () => {
  let [loading, setLoading] = useState(true)

  const location = useLocation()

  const [gameCallback, setGameCallback] =
    useState()
  const [gameData, setGameData] = useState({})

  const [modalIsOpen, setIsModalOpen] =
    useState(false)

  const [rivalEmail, setRivalEmail] = useState('')

  useEffect(() => {
    socket.emit('UPDATE', location.state.email)

    socket.on('GAME', (data, callback) => {
      setRivalEmail(data.rival.email)
      setGameCallback(callback)
      setGameData(data)
      setIsModalOpen(true)
    })

    socket.on('GAME_CAN_START', () =>
      history.push({
        pathname: '/game',
        state: { gameData },
      })
    )

    socket.on('GAME_CANCELLED', () =>
      history.push({
        pathname: '/lobby',
        state: { email },
      })
    )

    socket.emit('WANNA_PLAY')

    return () => {
      socket.off('GAME')
      socket.off('GAME_CANCELLED')
    }
  }, [])

  const handleGameAnswer = answer => {
    const res = {
      answer: answer
        ? 'ACCEPTED_MATCH'
        : 'REJECTED_MATCH',
      game: gameData,
    }
    socket.emit('RESPUESTA_GAME', res)
    history.push({
      pathname: '/game',
      state: { gameData },
    })
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        <p className="wanna-play-text">
          El rival {rivalEmail} quiere jugar
          contra ti
        </p>
        <div className="wanna-play-buttons-container">
          <button
            className="wanna-play-button"
            onClick={() => handleGameAnswer(true)}
          >
            Quiero jugar
          </button>
          <button
            className="wanna-play-button"
            onClick={() =>
              handleGameAnswer(false)
            }
          >
            Ahora no
          </button>
        </div>
      </Modal>
      {loading ? (
        <div className="lobby-container">
          {loading && (
            <h3 className="lobby-title">
              Buscando oponente...
            </h3>
          )}
          <ClipLoader
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <Game
          socket={{ socketUrl: '4fdfsfsf' }}
        />
      )}
    </>
  )
}

export default Lobby
