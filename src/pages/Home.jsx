import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { useHistory } from 'react-router-dom'
import Game from '../pages/Game'
import io from 'socket.io-client'
import '../App.css'

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    borderRadius: '10px',
    padding: '3rem',
  },
}

Modal.setAppElement('#app')

const socket = io(
  'https://server-tic-tac-toe.herokuapp.com'
)

export default function Home() {
  const [modalIsOpen, setIsModalOpen] =
    useState(true)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [isConnected, setIsConnected] = useState(
    socket.connected
  )

  const history = useHistory()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  const isEmail = email =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      email
    )

  const handleStart = e => {
    e.preventDefault()
    if (!email) {
      setEmailError('Favor de ingresar un email')
      return false
    }
    if (!isEmail(email)) {
      setEmailError(
        'Favor de ingresar un email válido'
      )
      return false
    }

    socket.emit('LOGIN', { email }, response => {
      if (response === 'REJECTED') {
        setEmail(
          'Intenta con otro email de favor'
        )
      } else if (response === 'WELCOME') {
        history.push({
          pathname: '/lobby',
          state: { email },
        })
      }
    })
  }

  return (
    <>
      <div className="container">
        <header>
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
          >
            <h3 className="modalTitle">
              Ingresa tu correo
            </h3>
            <form onSubmit={handleStart}>
              <div className="email-container">
                <input
                  name="email"
                  type="email"
                  onChange={e => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  className="email-input"
                />
                <input
                  type="submit"
                  value="Entrar"
                  className="send-button"
                />
                <span className="email-error">
                  {emailError}
                </span>
              </div>
            </form>
          </Modal>
          <h1 className="title">
            Tic Tac Toe en React by Brian Dev
          </h1>
        </header>
      </div>
    </>
  )
}
