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
      <Route exact path="/">
        <Home />
      </Route>
      <Switch>
        <Route exact path="/game">
          <Game />
        </Route>

        <Route exact path="/lobby">
          <Lobby />
        </Route>
      </Switch>
    </Router>
  )
}
