

// The base URL for calling the API is set here, so we only need to change it in this location

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8001/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
