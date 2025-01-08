export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
}

export function getUsername() {
    return localStorage.getItem('username');
}
