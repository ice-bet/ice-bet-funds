// NOTE: You need to install jwt-decode: npm install jwt-decode
import jwt_decode from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwt_decode(token);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user?.isAdmin === true;
};

export const login = (token) => {
  localStorage.setItem('token', token);
  const user = jwt_decode(token);
  localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
};

export const register = login;

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAdmin');
}; 