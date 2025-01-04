import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { userService } from '../services/user';

const useAuth = () => {
  useEffect(() => {
    try {
      const token = localStorage.getItem('jwt-token');

      if (!token) return;

      const decoded = jwtDecode(token);

      if (decoded && typeof decoded.exp === 'number') {
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          userService.setCurrentUser();
        } else {
          localStorage.removeItem('jwt-token');
        }
      }
    } catch (error) {
      localStorage.removeItem('jwt-token');
    }
  }, []);
};

export default useAuth;
