export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile: UserProfile;
    education: UserEducation[];
    platforms: UserPlatform[];
    objectives: UserObjective[];
}

export interface UserProfile {
    headline: string;
    summary: string;
    phone: string;
    location: string;
    availability: string;
    profileImageUrl: string;
    resumeUrl: string;
    dateOfBirth: string | null;
    nationality: string;
    languages: string[];
}

export interface UserEducation {
    id: number;
    institution: string;
    campus: string;
    qualification: string;
    course: string;
    specialisation: string;
    startYear: number | null;
    endYear: number | null;
    description: string;
    projectIds: number[];
    skillIds: number[];
}

export interface UserPlatform {
    id: number;
    platform: string;
    username: string;
    url: string;
    icon: string;
    isPublic: boolean;
}

export interface User extends AuthenticatedUser {
    profile: UserProfile;
    education: UserEducation[];
    platforms: UserPlatform[];
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface UserCredentialsRecord extends User {
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    role?: string;
    profile?: Partial<UserProfile>;
    education?: UserEducation[];
    platforms?: UserPlatform[];
    objectives?: UserObjective[];
}

export type UserObjectiveStatus =
    | 'Planned'
    | 'In Progress'
    | 'Completed';

export interface UserObjective {
    id: number;
    title: string;
    description: string;
    status: UserObjectiveStatus;
}