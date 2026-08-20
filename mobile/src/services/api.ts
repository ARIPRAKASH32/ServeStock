import axios from 'axios';

// Use your computer's local IP address instead of localhost for React Native
// when testing on a real device, or use 10.0.2.2 for Android Emulator.
// We'll assume the backend is available at this variable in dev.
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // Default for Android Emulator
});

api.interceptors.request.use(async (config) => {
  // In a real app, use AsyncStorage to get the token
  // const token = await AsyncStorage.getItem('token');
  // if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
