import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { ProjectsService } from '../../../core/projects/projects.service';
import { Project } from '../../../core/projects/projects.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    ],
})
export class ProjectsComponent implements OnInit {

    private readonly _dialog = inject(MatDialog);
    private readonly _projectsService = inject(ProjectsService);
    private readonly _destroyRef = inject(DestroyRef);

    readonly pageSize = 10;
    currentPage = 1;

    projectsList: Project[] = [];

    ngOnInit(): void {

        /*
         * Subscribe to the service state.
         *
         * Creating, updating, or deleting a project causes projects$
         * to emit a new array, which automatically refreshes the table.
         *
         * takeUntilDestroyed prevents the subscription from remaining
         * active after this component is destroyed.
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
         * Loads saved projects from localStorage.
         * If none exist, the service seeds them from projects.json.
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

    /*
     * Returns only the projects belonging to the current page.
     *
     * Page 1: indexes 0–9
     * Page 2: indexes 10–19
     */
    get paginatedProjects(): Project[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.projectsList.slice(
            startIndex,
            endIndex
        );
    }

    onPageChange(page: number): void {
        this.currentPage = page;
    }

    openDeleteDialog(project: Project): void {
        /*
         * The reusable dialog only returns true or false.
         * The Projects page remains responsible for performing the deletion.
         */
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

        dialogRef
            .afterClosed()
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

    deleteProject(projectId: number): void {
        this._projectsService
            .deleteProject(projectId)
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

    /*
     * If the final project on the final page is deleted,
     * move the user back to the last available page.
     *
     * Example:
     * Page 2 has one project.
     * That project is deleted.
     * The current page is corrected from 2 back to 1.
     */
    private _ensureValidCurrentPage(): void {
        const totalPages = Math.max(
            1,
            Math.ceil(
                this.projectsList.length /
                this.pageSize
            )
        );

        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
    }

}