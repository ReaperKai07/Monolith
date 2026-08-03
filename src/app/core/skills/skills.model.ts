export type SkillCategory =
    | 'Frontend'
    | 'Mobile'
    | 'Backend'
    | 'UI/UX'
    | 'Data'
    | 'Tools';

export type SkillType =
    | 'Language'
    | 'Framework'
    | 'Library'
    | 'Platform'
    | 'Database'
    | 'Design Tool'
    | 'Development Tool'
    | 'Concept';

export type SkillLevel =
    | 'Beginner'
    | 'Familiar'
    | 'Intermediate'
    | 'Advanced';

export interface Skill {
    id: number;
    name: string;
    icon: string;
    description: string;
    category: SkillCategory;
    type: SkillType;
    level: SkillLevel;
    experienceMonths: number;
    projectIds: number[];
}

export type CreateSkillRequest =
    Omit<Skill, 'id'>;

export type UpdateSkillRequest =
    Partial<Omit<Skill, 'id'>>;