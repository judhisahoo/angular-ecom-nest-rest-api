import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  access_token: string;
  isLoading: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  access_token: '',
  isLoading: false,
  error: null,
};
