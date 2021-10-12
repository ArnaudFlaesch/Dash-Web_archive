import axios, { AxiosResponse } from 'axios';
import { IUser } from './../model/User';

const headers = {
  'Content-type': 'application/json'
};

function login(username: string, password: string): Promise<unknown> {
  return axios
    .post<IUser>(
      `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
      {
        username,
        password
      },
      {
        headers
      }
    )
    .then((response: AxiosResponse<IUser>) => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
}

function logout(): void {
  localStorage.removeItem('user');
  window.location.reload();
}

function getCurrentUser(): unknown {
  if (localStorage.getItem('user')) {
    return JSON.parse(localStorage.getItem('user') || '');
  }
}

export default {
  login,
  logout,
  getCurrentUser
};
