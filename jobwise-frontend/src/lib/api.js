import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // or your backend port
  withCredentials: true, // if using cookies/auth
});

export default api;
