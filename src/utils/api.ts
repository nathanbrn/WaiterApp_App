import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://waiterappapi1.herokuapp.com',
});
