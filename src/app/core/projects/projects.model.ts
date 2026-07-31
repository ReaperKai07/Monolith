export type ProjectType =
    | 'Mobile'
    | 'Website';

export type ProjectPlatform =
    | 'iOS'
    | 'Android'
    | 'Desktop';

export type ProjectStatus =
    | 'Planning'
    | 'In Development'
    | 'On Hold'
    | 'Completed';

export interface Project {
    id: number;
    project: string;
    description: string;
    type: ProjectType;
    platform: ProjectPlatform[];
    technology: string[];
    scope: string[];
    startDate: Date | null;
    endDate: Date | null;
    status: ProjectStatus;
}

/**
 * Shape stored in JSON and localStorage.
 * Dates must be stored as strings because JSON has no Date type.
 */
export interface ProjectDto {
    id: number;
    project: string;
    description: string;
    type: ProjectType;
    platform: ProjectPlatform[];
    technology: string[];
    scope: string[];
    startDate: string | null;
    endDate: string | null;
    status: ProjectStatus;
}

export type CreateProjectRequest =
    Omit<Project, 'id'>;

export type UpdateProjectRequest =
    Partial<Omit<Project, 'id'>>;