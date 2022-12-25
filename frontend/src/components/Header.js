import React from 'react'
import '../index.css'
import logo from '../images/aroundtheus.svg'
import { useLocation, NavLink } from 'react-router-dom'

function Header({ loggedIn, signOut, email }) {
  let location = useLocation()
  let logOrRegister = 'Log in'
  let sendTo = true
  if (location.pathname === '/signin') {
    logOrRegister = 'Sign up'
    sendTo = false
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="around the u.s." />
      <div className="header__auth-wrapper">
        <span className="header__auth-email">{loggedIn ? email : ''}</span>
        <div className="header__auth-logic">
          {loggedIn ? (
            <button
              className="header__auth-link"
              onClick={signOut}
              style={{ color: '#A9A9A9' }}
            >
              Log out
            </button>
          ) : (
            <NavLink
              className="header__auth-link"
              to={sendTo ? '/signin' : '/register'}
            >
              {logOrRegister}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
