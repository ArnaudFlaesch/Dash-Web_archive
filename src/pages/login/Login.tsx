import { Button, CircularProgress, Input } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleError } from 'src/reducers/actions';
import logo from '../../assets/logo.png';
import AuthService from '../../services/auth.service';

export default function Login(): React.ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const ERROR_AUTHENTICATING_USER = "Erreur lors de la connexion de l'utilisateur.";

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  function handleLogin() {
    setLoading(true);

    if (username && password) {
      AuthService.login(username, password).then(
        () => {
          window.location.reload();
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          dispatch(handleError(error, ERROR_AUTHENTICATING_USER));
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
        <div className="flex flex-col mt-10 space-y-5">
          <Input id="inputUsername" placeholder="Username" value={username} onChange={onChangeUsername} />

          <Input
            id="inputPassword"
            placeholder="Password"
            type="password"
            value={password}
            onChange={onChangePassword}
          />

          <Button
            id="loginButton"
            disabled={!username || !password || loading}
            onClick={handleLogin}
            variant="contained"
            className="flex mx-auto"
          >
            {loading && <CircularProgress className="mr-5" />}
            <span>Se connecter</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
