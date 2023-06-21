// utils/auth.js

let isAuthenticated = false;

export function checkAuth() {
  return isAuthenticated;
}

export function setAuth(value) {
  isAuthenticated = value;
}
