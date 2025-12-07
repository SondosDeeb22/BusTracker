//====================================================================================================================================
//? useAuth Hook - Get current user data and authentication status
//====================================================================================================================================

import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserData {
  userID: string;
  userName: string;
  userRole: string;
}

interface UseAuthReturn {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/me', {
          withCredentials: true
        });
        
        const userData = response.data.data;
        setUser(userData);
        setError(null);
        //----------------------------------------------------------
      } catch (err) {
        setUser(null);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    error
  };
};
