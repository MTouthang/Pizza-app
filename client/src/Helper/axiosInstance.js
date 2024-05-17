import axios from 'axios';

// const BASE_URL =
//   import.meta.env.MODE === 'production'
//     ? 'https://pizza-app-x3m4.onrender.com/api/v1'
//     : 'http://localhost:8081/api/v1';

const BASE_URL = 'https://pizza-app-x3m4.onrender.com/api/v1';

console.log(BASE_URL);

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
