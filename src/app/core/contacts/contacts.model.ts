export interface ContactGroup {
    id: number;
    name: string;
    logo: string;
    location: string;
    references: ContactReference[];
}

export interface ContactReference {
    id: number;
    name: string;
    image: string;
    title: string;
    phone: string;
    email: string;
}