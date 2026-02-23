// ======================================================================================
//? Importing
// ======================================================================================
import axios from 'axios';

import { backendBaseUrl } from '../constants/env';

// ------------------------------------------------------
// API client
export const apiClient = axios.create({
  baseURL: backendBaseUrl,
  withCredentials: true
});
