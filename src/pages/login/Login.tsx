import React, { useState } from 'react';
import AuthService from '../../services/auth.service';
import logo from '../../assets/logo.png';

export default function Login(): React.ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  function handleLogin() {
    setMessage('');
    setLoading(true);

    if (username && password) {
      AuthService.login(username, password).then(
        () => {
          window.location.reload();
          setLoading(false);
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="text-center m-auto">
        <div>
          <img src={logo} className="mx-auto" alt="dash logo" />
        </div>
        <div>
          <h1 className="text-5xl">Dash</h1>
        </div>
        <div className="mt-10 space-y-5">
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="inputUsername"
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="inputPassword"
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          <button
            id="loginButton"
            disabled={!username || !password || loading}
            onClick={handleLogin}
            className="flex mx-auto btn btn-success btn-block"
          >
            {loading && <span className="spinner-border spinner-border-sm"></span>}
            <span>Se connecter</span>
          </button>

          {message && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
