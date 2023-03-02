import React, { useState, useEffect } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import {
  useHistory,
  useLocation,
} from 'react-router-dom'
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
  'https://server-tic-tac-toe.herokuapp.com'
)

const Lobby = () => {
  let [loading, setLoading] = useState(true)

  const location = useLocation()

  const history = useHistory()

  const [gameData, setGameData] = useState({})

  const [modalIsOpen, setIsModalOpen] =
    useState(false)

  const [rivalEmail, setRivalEmail] = useState('')

  const [waitingForRival, setWaitingForRival] =
    useState(false)

  useEffect(() => {
    socket.emit('UPDATE', location.state.email)

    socket.on('GAME', data => {
      setRivalEmail(data.rival.email)
      setGameData(data)
      setIsModalOpen(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('GAME_CAN_START', gameData => {
      history.push({
        pathname: '/game',
        state: { gameData },
      })
    })

    socket.on('GAME_CANCELLED', () => {
      history.push({
        pathname: '/lobby',
        state: { email: location.state.email },
      })
      setIsModalOpen(false)
      setLoading(true)
      setTimeout(() => {
        socket.emit('WANNA_PLAY')
      }, 3000)
    })

    socket.emit('WANNA_PLAY')

    return () => {
      socket.off('GAME')
      socket.off('GAME_CANCELLED')
      socket.off('GAME_CAN_START')
      socket.off('disconnect')
    }
  }, [])

  const handleGameAnswer = answer => {
    setWaitingForRival(answer)
    const res = {
      answer: answer
        ? 'ACCEPTED_MATCH'
        : 'REJECTED_MATCH',
      game: gameData,
    }
    socket.emit('RESPUESTA_GAME', res)
    // history.push({
    //   pathname: '/game',
    //   state: { gameData },
    // })
  }

  console.log(gameData)

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        {waitingForRival ? (
          <div>
            <p>
              Esperando confirmación de{' '}
              {rivalEmail}...
            </p>
          </div>
        ) : (
          <>
            <p className="wanna-play-text">
              El rival {rivalEmail} quiere jugar
              contra ti
            </p>
            <div className="wanna-play-buttons-container">
              <button
                className="wanna-play-button"
                onClick={() =>
                  handleGameAnswer(true)
                }
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
          </>
        )}
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
        <Game />
      )}
    </>
  )
}

export default Lobby
