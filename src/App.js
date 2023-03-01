import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom'

import Game from './pages/Game'
import Home from './pages/Home'
import Lobby from './pages/Lobby'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game">
          <Game />
        </Route>

        <Route path="/lobby">
          <Lobby />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
