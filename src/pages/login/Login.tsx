import React, { useState } from 'react';
import AuthService from '../../services/auth.service';

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
    <div className="col-md-12">
      <div>
        <div className="form-group">
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

        <div className="form-group">
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

        <div className="form-group">
          <button
            id="loginButton"
            disabled={!username || !password || loading}
            onClick={handleLogin}
            className="btn btn-success btn-block"
          >
            {loading && <span className="spinner-border spinner-border-sm"></span>}
            <span>Se connecter</span>
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
