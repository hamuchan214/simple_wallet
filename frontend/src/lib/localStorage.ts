export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
}

export function getUsername() {
    return localStorage.getItem('username');
}

export function setSession(token: string, id: string, username: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', id);
  localStorage.setItem('username', username);
}