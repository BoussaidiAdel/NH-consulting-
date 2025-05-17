  export interface AppState {
      selectedLanguage: string;
      auth: AuthState;
    }
    
    export interface AuthState {
      userId: string | null;
      role: string | null;
    }
    