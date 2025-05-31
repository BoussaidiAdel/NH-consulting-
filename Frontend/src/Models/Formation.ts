export interface Formation {
  id?: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  prix: number;
  image: string;
  duree: number;
  nomFormateur: string;
  etat: {
    fr: string;
    en: string;
  };
  niveau: {
    fr: string;
    en: string;
  };
  prerequis: string | {
    fr: string;
    en: string;
  };
  programme: string | {
    fr: string;
    en: string;
  };
  active?: boolean;
  dateDebut?: string;
  dateFin?: string;
  placesDisponibles?: number;
}

// models/formation-subscription.model.ts
export interface FormationSubscription {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    educationLevel: string;
    age: number;
    studentClass: string;
    formationId: string;
    formationTitle: string;
    formationPrice?: number;
  }
  
export interface FormationSubscriptionRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    educationLevel: string;
    age: number;
    studentClass: string;
    formationId: string;
  }