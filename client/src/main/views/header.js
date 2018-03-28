import React, { Component } from 'react'

import '../styles/header.css'

import WebApi from '../web-api'

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }
  render() {
    /*
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    localStorage.setItem('authenticated', JSON.stringify(true))
    return (
      <Redirect to={from} />
    )
    */
    return (
      <div className='mainpage-header'>
        <div className='mainpage-header-left'>
          Virtual Coin Exchange
        </div>
        <div className='mainpage-header-right'>
          <form className='credentials-container' onSubmit={this.login}>
            <input type='text' placeholder='Username' value={this.state.username} onChange={this.changeInput} />
            <input type='text' placeholder='Password' value={this.state.password} onChange={this.changeInput} />
            <button>Sign in</button>
          </form>
        </div>
      </div>
    )
  }

  login = async(event) => {
    event.preventDefault()
    const response = await WebApi.login(
      this.state.username,
      this.state.password,
    )
    console.log(response)
  }

  changeInput = (event) => {
    const name = event.target.placeholder.toLowerCase()
    this.setState({
      [name]: event.target.value
    })
  }
}

export default Header