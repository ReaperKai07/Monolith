import { DatePipe, NgClass, SlicePipe} from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Experience } from '../../../core/experiences/experiences.model';
import { ExperiencesService } from '../../../core/experiences/experiences.service';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ProjectsService } from '../../../core/projects/projects.service';
import { DetailsExperiencesComponent, DetailsExperiencesDialogData } from './details-experiences/details-experiences.component';

@Component({
    selector: 'app-experiences',
    standalone: true,
    templateUrl: './experiences.component.html',
    imports: [
        DatePipe,
        NgClass,
        SlicePipe,
        MatTooltipModule,
        PaginationComponent,
        SearchComponent,
    ],
})
export class ExperiencesComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _experiencesService = inject(ExperiencesService);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _projectsService = inject(ProjectsService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly pageSize = 10;
    currentPage = 1;
    searchTerm = '';
    experiencesList: Experience[] = [];
    projectNameMap = new Map<number, string>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        /*
         * Subscribe to experiences service
         */
        this._experiencesService.experiences$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(experiences => {
                this.experiencesList = experiences;
                this._ensureValidCurrentPage();
            });

        /*
         * Load experiences from localStorage, or seed them from experiences.json
         */
        this._experiencesService
            .initializeExperiences()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error('Failed to initialize experiences:', error);
                },
            });

            /*
            * Subscribe to projects service and create ID-to-name lookup
            */
            this._projectsService.projects$
                .pipe(
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe(projects => {
                    this.projectNameMap = new Map(
                        projects.map(project => [
                            project.id,
                            project.project,
                        ])
                    );
                });

            /*
            * Load projects used by linked experience records
            */
            this._projectsService
                .initializeProjects()
                .pipe(
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe({
                    error: error => {
                        console.error('Failed to initialize projects:', error);
                    },
                });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns experiences matching the current search term
     */
    get filteredExperiences(): Experience[] {
        if (!this.searchTerm) {
            return this.experiencesList;
        }
        const search = this.searchTerm.toLowerCase();
        return this.experiencesList.filter(experience => {
            const searchableValues = [
                experience.company,
                experience.jobTitle,
                experience.description,
                experience.employmentType,
                experience.location,
                ...this.getProjectNames(
                    experience.projectIds
                ),
            ];
            return searchableValues.some(value =>
                value.toLowerCase().includes(search)
            );
        });
    }

    /**
     * Returns experiences for the current page
     */
    get paginatedExperiences(): Experience[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredExperiences.slice(
            startIndex,
            endIndex
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the create experience dialog
     */
    openCreateDialog(): void {
        this._openDetailsDialog({
            mode: 'create',
        });
    }

    /**
     * Opens the edit experience dialog
     */
    openEditDialog(
        experience: Experience
    ): void {
        this._openDetailsDialog({
            mode: 'edit',
            experience,
        });
    }

    /**
     * Opens the reusable delete confirmation dialog
     */
    openDeleteDialog(experience: Experience): void {
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
                    itemName: `${experience.jobTitle} at ${experience.company}`,
                    itemType: 'experience',
                },
            }
        );

        dialogRef
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(confirmed => {
                if (!confirmed) {
                    return;
                }

                this.deleteExperience(experience.id);
            });
    }

    /**
     * Deletes an experience by ID
     */
    deleteExperience(experienceId: number): void {
        this._experiencesService
            .deleteExperience(experienceId)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error('Failed to delete experience:', error);
                },
            });
    }

    /**
     * Returns linked project names by project ID.
     * @param projectIds
     * @returns
     */
    getProjectNames(projectIds: number[]): string[] {
        return projectIds
            .map(projectId =>
                this.projectNameMap.get(projectId)
            )
            .filter(
                (projectName): projectName is string =>
                    !!projectName
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Moves to the last available page when needed
     */
    private _ensureValidCurrentPage(): void {
        const totalPages = Math.max(
            1,
            Math.ceil(
                this.filteredExperiences.length /
                this.pageSize
            )
        );

        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
    }

    /**
     * Opens the create or edit experience dialog
     */
    private _openDetailsDialog(
        data: DetailsExperiencesDialogData
    ): void {
        this._dialog.open<
            DetailsExperiencesComponent,
            DetailsExperiencesDialogData,
            Experience
        >(
            DetailsExperiencesComponent,
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
     * Handles page changes emitted by PaginationComponent
     */
    onPageChange(page: number): void {
        this.currentPage = page;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Search methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates the search term and resets the current page
     */
    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
    }

}