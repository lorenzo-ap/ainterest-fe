import { useEffect } from 'react';
import { setAuthLoading } from '../redux/slices';
import { store } from '../redux/store';
import { userService } from '../services/user';

export const useAuth = () => {
  useEffect(() => {
    const authUser = async () => {
      try {
        await userService.setCurrentUser();
      } catch (error) {
        console.error('Auth failed:', error);
      } finally {
        store.dispatch(setAuthLoading(false));
      }
    };

    authUser();
  }, []);
};
