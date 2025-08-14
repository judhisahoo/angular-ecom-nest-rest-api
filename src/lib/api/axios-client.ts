import axios from 'axios';
import { environment } from '../../environments/environment';
import { getLocalStorageWithExpiration } from '../helper/storage';

//const API_BASE_URL =
//process.env['NEST_PUBLIC_API_URL'] || 'http://localhost:5000';

const axiosClient = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getLocalStorageWithExpiration('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      //config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      'error.response in axiosInstance.interceptors.response',
      error.response
    );
    if (error.response?.status === 401) {
      // Dispatch logout action to clear user state
      //store.dispatch(logout());
      // Redirect to the login page
      //window.location.href = '/login';
    }

    if (error.response === undefined) {
      // Re-throw a new error with a user-friendly message
      throw new Error('API server is not working. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
