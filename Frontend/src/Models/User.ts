export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; 
    role?: string;
    verified?: boolean;
  }


  export interface RegistreUser {
    firstName: string;
    lastName: string;
    email: string;
    password?: string; 
  }