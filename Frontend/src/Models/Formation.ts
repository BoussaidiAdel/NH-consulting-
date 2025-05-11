export interface Formation {
    id: string;
    title: string;
    description: string;
    prix: number;
    image: string;
    imageUrl?: string;
    duree: number;
    nomFormateur: string;
    etat: 'En ligne' | 'Présentiel' | string;
    niveau: string;
    active?: boolean;
    dateDebut?: string;
    dateFin?: string;
    placesDisponibles?: number;
    prerequis?: string;
    programme?: string;
}
