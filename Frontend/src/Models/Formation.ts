export interface Formation {
    id: string;
    title: string;
    description: string;
    prix: number;
    imageUrl: string;
    duree: number;
    nomFormateur: string;
    etat: 'En ligne' | 'Présentiel' | string;
    niveau: string;
    active?: boolean;
  }
