export interface AppState {
    selectedLanguage: string;
    auth: AuthState;
  }
  
  export interface AuthState {
    isLoggedIn: boolean;
    user: any | null;
    role: string | null;
  }
  