import axios, { AxiosResponse } from 'axios';

const headers = {
  'Content-type': 'application/json'
};

function login(username: string, password: string): Promise<AxiosResponse<unknown>> {
  return axios
    .post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
      {
        username,
        password
      },
      {
        headers
      }
    )
    .then((response) => {
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
