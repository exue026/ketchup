import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import PrivateRoute from '../shared/views/private-route'

import './styles/App.css'

import MainPage from '../main/views'
import HomePage from '../home/views'
import GamePage from '../game/views'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={MainPage} />
          <PrivateRoute path='/home' component={HomePage} />
          <PrivateRoute path='/games/:gameId' component={GamePage} />
        </div>
      </Router>
    )
  }
}

export default App
