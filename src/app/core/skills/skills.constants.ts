import {
    SkillCategory,
    SkillLevel,
    SkillType,
} from './skills.model';

export const SKILL_CATEGORIES: SkillCategory[] = [
    'Frontend',
    'Mobile',
    'Backend',
    'UI/UX',
    'Data',
    'Tools',
];

export const SKILL_TYPES: SkillType[] = [
    'Language',
    'Framework',
    'Library',
    'Platform',
    'Database',
    'Design Tool',
    'Development Tool',
    'Concept',
];

export const SKILL_LEVELS: SkillLevel[] = [
    'Beginner',
    'Familiar',
    'Intermediate',
    'Advanced',
];

export const SKILL_LEVEL_VALUES: Record<SkillLevel, number> = {
    Beginner: 1,
    Familiar: 2,
    Intermediate: 3,
    Advanced: 4,
};