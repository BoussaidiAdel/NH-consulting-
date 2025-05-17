
export interface ContactFormData {
    fullname: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }
  

export interface ContactResponse {
    success: boolean;
    message: string;
  }
  