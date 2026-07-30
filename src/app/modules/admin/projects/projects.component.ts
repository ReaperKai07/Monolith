import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';

type ProjectType = 'Mobile' | 'Website';
type ProjectPlatform = 'iOS' | 'Android' | 'Desktop';
type ProjectStatus = 'Planning' | 'In Development' | 'On Hold' | 'Completed';

interface ProjectsList {
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

@Component({
    selector: 'app-projects',
    standalone: true,
    templateUrl: './projects.component.html',
    imports: [
        DatePipe,
        NgClass,
        PaginationComponent,
        SlicePipe,
        MatTooltipModule,
    ],
})
export class ProjectsComponent {

    readonly pageSize = 10;
    currentPage = 1;

    get paginatedProjects(): ProjectsList[] {
        const startIndex =
            (this.currentPage - 1) * this.pageSize;

        const endIndex =
            startIndex + this.pageSize;

        return this.projectsList.slice(
            startIndex,
            endIndex
        );
    }

    onPageChange(page: number): void {
        this.currentPage = page;
    }

    projectsList: ProjectsList[] = [
        {
            id: 1,
            project: 'Monolith',
            description: 'Developer dashboard showcasing enterprise Angular architecture, authentication, and reusable components.',
            type: 'Website',
            platform: [ 'Desktop', 'Android'],
            technology: [ 'Angular', 'TypeScript', 'Tailwind', 'RxJS' ],
            scope: [ 'Frontend', 'UI/UX', ],
            startDate: new Date('2026-06-01'),
            endDate: null,
            status: 'In Development',
        },
        {
            id: 2,
            project: 'Obelisk',
            description: 'Frontend playground for exploring modern React patterns and UI experimentation.',
            type: 'Website',
            platform: [ 'Desktop', 'Android'],
            technology: [ 'React', 'TypeScript', 'Tailwind', ],
            scope: [ 'Frontend', 'UI/UX', ],
            startDate: null,
            endDate: null,
            status: 'On Hold',
        },
        {
            id: 3,
            project: 'Dolmen',
            description: 'Fictional telco self-service mobile application demonstrating authentication, eKYC, subscriptions, and billing workflows.',
            type: 'Mobile',
            platform: [ 'Android'],
            technology: [ 'Angular', 'TypeScript', 'Capacitor', 'Ionic', 'Tailwind', 'RxJS' ],
            scope: [ 'Frontend', 'UI/UX', ],
            startDate: null,
            endDate: null,
            status: 'Planning',
        },
    ];

}