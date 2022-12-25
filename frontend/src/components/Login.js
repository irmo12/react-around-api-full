import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Login({onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      return;      
      }
    onLogin({email,password});
  }
  
  return (
    <div className="auth">
      <h1 className="auth__heading">
        Log in
      </h1>
      <form onSubmit={handleSubmit} className="auth__form">
      <div className="auth__inputs">
        <input className="auth__input" required id="email" name="email" type="text" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="auth__input" required id="password" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div className="auth__button-container">
        <button type="submit" className="auth__submit">Log in</button>
      </div>
      </form>
      <div className="auth__signup">
        <Link className="auth__link" to="/register">Not a member yet? Sign up here!</Link>
      </div>
    </div>
    );
}

export default Login;