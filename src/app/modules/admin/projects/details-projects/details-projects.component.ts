import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateProjectRequest, Project, ProjectPlatform, ProjectStatus, ProjectType, UpdateProjectRequest } from '../../../../core/projects/projects.model';
import { ProjectsService } from '../../../../core/projects/projects.service';
import {
    PROJECT_FEATURES,
    PROJECT_PLATFORMS,
    PROJECT_SCOPES,
    PROJECT_STATUSES,
    PROJECT_TECHNOLOGIES,
    PROJECT_TYPES,
} from '../../../../core/projects/projects.constants';

export type DetailsProjectsMode = 'create' | 'edit';

export interface DetailsProjectsDialogData {
    mode: DetailsProjectsMode;
    project?: Project;
}

@Component({
    selector: 'app-details-projects',
    standalone: true,
    templateUrl: './details-projects.component.html',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
    ],
    providers: [
        provideNativeDateAdapter(),
    ],
})

export class DetailsProjectsComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _formBuilder = inject(FormBuilder);
    private readonly _projectsService = inject(ProjectsService);
    private readonly _dialogRef = inject(MatDialogRef<DetailsProjectsComponent>);
    private readonly _destroyRef = inject(DestroyRef);

    readonly data = inject<DetailsProjectsDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly projectTypes = PROJECT_TYPES;
    readonly projectPlatforms = PROJECT_PLATFORMS;
    readonly projectStatuses = PROJECT_STATUSES;
    readonly availableTechnologies = PROJECT_TECHNOLOGIES;
    readonly availableScopes = PROJECT_SCOPES;
    readonly availableFeatures = PROJECT_FEATURES;

    isSubmitting = false;

    readonly projectForm = this._formBuilder.group(
        {
            project: [ '', [ Validators.required, Validators.maxLength(100), ], ],
            description: [ '', [ Validators.required, Validators.maxLength(500), ], ],
            type: [ null as ProjectType | null, Validators.required, ],
            platform: [ [] as ProjectPlatform[], Validators.required, ],
            technology: [ [] as string[], Validators.required, ],
            scope: [ [] as string[], Validators.required, ],
            features: [ [] as string[], Validators.required, ],
            startDate: [ null as Date | null, ],
            endDate: [ {value: null as Date | null, disabled: true, }, ],
            status: [ null as ProjectStatus | null, Validators.required, ],
        }
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Populate form when editing existing project.
        if (this.data.mode === 'edit' && this.data.project) {
            this.populateForm(this.data.project);
        }
        // Enable endDate only after startDate selected.
        this.projectForm.controls.startDate.valueChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(startDate => {
                const endDateControl = this.projectForm.controls.endDate;
                if (startDate) {
                    endDateControl.enable();
                    return;
                }
                endDateControl.reset();
                endDateControl.disable();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Closes dialog
     */
    cancel(): void {
        this._dialogRef.close();
    }

    /**
     * Submits form
     * @returns 
     */
    submit(): void {
        if (this.projectForm.invalid) {
            this.projectForm.markAllAsTouched();
            return;
        }
        this.isSubmitting = true;
        this.projectForm.disable();
        const formValue = this.projectForm.getRawValue();
        const request: CreateProjectRequest = {
            project: formValue.project!,
            description: formValue.description!,
            type: formValue.type!,
            platform: formValue.platform!,
            technology: formValue.technology!,
            scope: formValue.scope!,
            features: formValue.features!,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            status: formValue.status!,
        };
        if (this.data.mode === 'edit' && this.data.project ) {
            this.updateProject(
                this.data.project.id,
                request
            );
            return;
        } 
        this.createProject(request);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fill form with data
     * @param project 
     */
    private populateForm(project: Project): void {
        this.projectForm.patchValue({
            project: project.project,
            description: project.description,
            type: project.type,
            platform: [...project.platform],
            technology: [...project.technology],
            scope: [...project.scope],
            features: [...(project.features ?? [])],
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            status: project.status,
        });
        if (project.startDate) {
            this.projectForm.controls.endDate.enable();
        }
    }

    /**
     * Creates new project
     * @param request 
     */
    private createProject(
        request: CreateProjectRequest
    ): void {
        this._projectsService.createProject(request)
            .subscribe({
                next: project => {
                    this._dialogRef.close(project);
                },
                error: error => {
                    console.error('Failed to create project:', error);
                    this.restoreForm();
                },
            });
    }

    /**
     * Updates existing project
     * @param projectId 
     * @param request 
     */
    private updateProject(
        projectId: number,
        request: UpdateProjectRequest
    ): void {
        this._projectsService.updateProject(projectId, request)
            .subscribe({
                next: project => {
                    this._dialogRef.close(project);
                },
                error: error => {
                    console.error('Failed to update project:', error);
                    this.restoreForm();
                },
            });
    }

    /**
     * Keep form on original state if failed submission
     */
    private restoreForm(): void {
        this.isSubmitting = false;
        this.projectForm.enable();
        // Disable endDate if startDate not selected
        if (!this.projectForm.controls.startDate.value) {
            this.projectForm.controls.endDate.disable();
        }
    }
 
}