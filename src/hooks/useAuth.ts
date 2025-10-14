import { useEffect } from 'react';
import { refreshToken } from '../api/auth';
import { setAuthLoading } from '../redux/slices';
import { store } from '../redux/store';
import { userService } from '../services/user';
import { getAccessToken, removeAccessToken, setAccessToken } from '../utils';

export const useAuth = () => {
  useEffect(() => {
    const authUser = async () => {
      const accessToken = getAccessToken();

      try {
        if (!accessToken) {
          const response = await refreshToken();
          setAccessToken(response.data.accessToken);
        }

        await userService.setCurrentUser();
      } catch (error) {
        console.error('Auth failed:', error);
        removeAccessToken();
      } finally {
        store.dispatch(setAuthLoading(false));
      }
    };

    authUser();
  }, []);
};
