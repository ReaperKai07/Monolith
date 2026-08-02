import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { ProjectsService } from '../../../core/projects/projects.service';
import { Project } from '../../../core/projects/projects.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsProjectsComponent, DetailsProjectsDialogData } from './details-projects/details-projects.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    templateUrl: './projects.component.html',
    imports: [
        NgClass,
        DatePipe,
        SlicePipe,
        MatTooltipModule,
        PaginationComponent,
        SearchComponent,
    ],
})
export class ProjectsComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _projectsService = inject(ProjectsService);
    private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly pageSize = 10;
    currentPage = 1;
    searchTerm = '';
    projectsList: Project[] = [];

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to the projects service
         */
        this._projectsService.projects$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(projects => {
                this.projectsList = projects;
                this._ensureValidCurrentPage();
            });

        /*
         * Load projects data from localStorage, or take from projects.json
         */
        this._projectsService
            .initializeProjects()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error(
                        'Failed to initialize projects:',
                        error
                    );
                },
            });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns projects matching the current search term
     */
    get filteredProjects(): Project[] {
        if (!this.searchTerm) {
            return this.projectsList;
        }
        const search = this.searchTerm.toLowerCase();
        return this.projectsList.filter(project => {
            const searchableValues = [
                project.project,
                project.type,
                project.status,
                ...project.platform,
                ...project.technology,
                ...project.scope,
            ];
            return searchableValues.some(value =>
                value.toLowerCase().includes(search)
            );
        });
    }

    /*
     * Returns projects for the current page
     */
    get paginatedProjects(): Project[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredProjects.slice(
            startIndex,
            endIndex
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens confirm delete dialog
     * @param project 
     */
    openDeleteDialog(project: Project): void {
        const dialogRef = this._dialog.open<
            DeleteDialogComponent,
            DeleteDialogData,
            boolean
        >(
            DeleteDialogComponent,
            {
                width: '420px',
                maxWidth: 'calc(100vw - 32px)',
                autoFocus: false,
                data: {
                    itemName: project.project,
                    itemType: 'project',
                },
            }
        );
        dialogRef.afterClosed()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.deleteProject(project.id);
            });

    }

    /**
     * Delete by project ID
     * @param projectId 
     */
    deleteProject(projectId: number): void {
        this._projectsService.deleteProject(projectId)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error(
                        'Failed to delete project:',
                        error
                    );
                },
            });
    }

    /**
     * Set and open create project dialog
     */
    openCreateDialog(): void {
        this._openDetailsDialog({
            mode: 'create',
        });
    }

    /**
     * Set and open edit project dialog
     * @param project
     */
    openEditDialog(project: Project): void {
        this._openDetailsDialog({
            mode: 'edit',
            project,
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /*
     * Move to last available page
     */
    private _ensureValidCurrentPage(): void {
        const totalPages = Math.max(
            1,
            Math.ceil(
                this.filteredProjects.length /
                this.pageSize
            )
        );
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
    }

    /**
     * Opens details dialog
     * @param data 
     */
    private _openDetailsDialog(
        data: DetailsProjectsDialogData
    ): void {
        this._dialog.open<
            DetailsProjectsComponent,
            DetailsProjectsDialogData,
            Project
        >(
            DetailsProjectsComponent,
            {
                width: '600px',
                maxWidth: 'calc(100vw - 32px)',
                maxHeight: 'calc(100vh - 32px)',
                autoFocus: false,
                data,
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Pagination methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handles page change event
     * @param page 
     */
    onPageChange(page: number): void {
        this.currentPage = page;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Search methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates search term and reset current page
     * @param searchTerm 
     */
    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
    }

}