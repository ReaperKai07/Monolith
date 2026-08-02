import {
    ProjectPlatform,
    ProjectStatus,
    ProjectType,
} from './projects.model';

// -----------------------------------------------------------------------------------------------------
// @ Project types
// -----------------------------------------------------------------------------------------------------

export const PROJECT_TYPES: readonly ProjectType[] = [
    'Website',
    'Mobile',
];

// -----------------------------------------------------------------------------------------------------
// @ Project platforms
// -----------------------------------------------------------------------------------------------------

export const PROJECT_PLATFORMS: readonly ProjectPlatform[] = [
    'Desktop',
    'Android',
    'iOS',
];

// -----------------------------------------------------------------------------------------------------
// @ Project statuses
// -----------------------------------------------------------------------------------------------------

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
    'Planning',
    'In Development',
    'On Hold',
    'Completed',
];

// -----------------------------------------------------------------------------------------------------
// @ Project technologies
// -----------------------------------------------------------------------------------------------------

export const PROJECT_TECHNOLOGIES: readonly string[] = [
    'Angular',
    'React',
    'TypeScript',
    'Tailwind',
    'RxJS',
    'Ionic',
    'Capacitor',
];

// -----------------------------------------------------------------------------------------------------
// @ Project scopes
// -----------------------------------------------------------------------------------------------------

export const PROJECT_SCOPES: readonly string[] = [
    'Frontend',
    'Backend',
    'UI/UX',
];

// -----------------------------------------------------------------------------------------------------
// @ Project features
// -----------------------------------------------------------------------------------------------------

export const PROJECT_FEATURES: readonly string[] = [
    'Authentication Flow',
    'JWT Authentication',
    'Refresh Token Flow',
    'Route Guards',
    'HTTP Interceptors',
    'RESTful API Integration',
    'Reactive Forms',
    'CRUD Operations',
    'Reusable Components',
    'Reusable Dialogs',
    'Reusable Search',
    'Reusable Pagination',
    'Responsive Design',
    'Mock Backend',
    'Local Storage Persistence',
    'Role-Based Authorization',
    'eKYC Workflow',
    'Cross-Platform Mobile',
    'Customer Self-Service',
    'Marketplace UI',
    'Product Browsing',
    'Legacy Migration',
    'Figma Implementation',
    'Feature Enhancements',
    'Bug Fixes',
    'iOS Porting',
];