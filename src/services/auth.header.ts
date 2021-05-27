export default function authHeader(): Record<string, unknown> {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    if (user && user.accessToken) {
      return {
        headers: {
          Authorization: 'Bearer ' + user.accessToken,
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    } else {
      return {};
    }
  } else {
    return {};
  }
}
