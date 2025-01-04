import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});

export default axiosInstance; 