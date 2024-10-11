import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
  try {
    const response = await instance.get('/csrf_token');
    instance.defaults.headers['X-CSRF-Token'] = response.data.csrf_token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// Call this function before making any requests that require CSRF protection
fetchCSRFToken();

export default instance;