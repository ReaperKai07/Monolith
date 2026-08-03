export type CertificateType =
    | 'Certification'
    | 'Course'
    | 'Workshop'
    | 'Training';

export interface Certificate {
    id: number;
    name: string;
    issuer: string;
    type: CertificateType;
    description: string;
    issueDate: Date | null;
    expiryDate: Date | null;
    credentialId: string;
    credentialUrl: string;
    certificateFileUrl: string;
    logo: string;
    skillIds: number[];
}

export type CreateCertificateRequest = Omit<Certificate, 'id'>;

export type UpdateCertificateRequest = Partial<Omit<Certificate, 'id'>>;