export type EmploymentType = 'Internship' | 'Full Time' | 'Contract';

export interface Experience {
    id: number;
    company: string;
    jobTitle: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    projectIds: number[];
    employmentType: EmploymentType;
    location: string;
}

export interface ExperienceDto {
    id: number;
    company: string;
    jobTitle: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    projectIds: number[];
    employmentType: EmploymentType;
    location: string;
}

export type CreateExperienceRequest =
    Omit<Experience, 'id'>;

export type UpdateExperienceRequest =
    Partial<Omit<Experience, 'id'>>;