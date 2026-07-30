import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormField } from "@angular/material/form-field";

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
        MatFormField,
        DatePipe,
        NgClass
    ],
})
export class ProjectsComponent {

    readonly pageSize = 10;
    currentPage = 1;

    /**
     * Constructor
     */
    constructor(){}

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

    /**
     * Paginations Stuff
     */
    get totalPages(): number {
        return Math.max(
            1,
            Math.ceil(this.projectsList.length / this.pageSize)
        );
    }

    get paginatedProjects(): ProjectsList[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        return this.projectsList.slice(startIndex, endIndex);
    }

    get pageNumbers(): number[] {
        return Array.from(
            { length: this.totalPages },
            (_, index) => index + 1
        );
    }

    get firstDisplayedProject(): number {
        if (this.projectsList.length === 0) {
            return 0;
        }

        return (this.currentPage - 1) * this.pageSize + 1;
    }

    get lastDisplayedProject(): number {
        return Math.min(
            this.currentPage * this.pageSize,
            this.projectsList.length
        );
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }

        this.currentPage = page;
    }

    previousPage(): void {
        this.goToPage(this.currentPage - 1);
    }

    nextPage(): void {
        this.goToPage(this.currentPage + 1);
    }


}