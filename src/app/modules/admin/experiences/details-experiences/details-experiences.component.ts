import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPLOYMENT_TYPES } from '../../../../core/experiences/experiences.constants';
import { 
    CreateExperienceRequest, 
    EmploymentType, 
    Experience, 
    UpdateExperienceRequest 
} from '../../../../core/experiences/experiences.model';
import { ExperiencesService } from '../../../../core/experiences/experiences.service';
import { Project } from '../../../../core/projects/projects.model';
import { ProjectsService } from '../../../../core/projects/projects.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

export type DetailsExperiencesMode = 'create' | 'edit';

export interface DetailsExperiencesDialogData {
    mode: DetailsExperiencesMode;
    experience?: Experience;
}

@Component({
    selector: 'app-details-experiences',
    standalone: true,
    templateUrl: './details-experiences.component.html',
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

export class DetailsExperiencesComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _formBuilder = inject(FormBuilder);
    private readonly _experiencesService = inject(ExperiencesService);
    private readonly _projectsService = inject(ProjectsService);
    private readonly _dialogRef = inject(MatDialogRef<DetailsExperiencesComponent>);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _snackbarService = inject(SnackbarService)
    
    readonly data = inject<DetailsExperiencesDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly employmentTypes = EMPLOYMENT_TYPES;
    
    projectsList: Project[] = [];

    isSubmitting = false;

    readonly experienceForm = this._formBuilder.group({
        company: [ '', [ Validators.required, Validators.maxLength(100), ], ],
        jobTitle: [ '', [ Validators.required, Validators.maxLength(100), ], ],
        employmentType: [ null as EmploymentType | null, Validators.required, ],
        location: [ '', [ Validators.required, Validators.maxLength(150), ], ],
        description: [ '', [ Validators.required, Validators.maxLength(500), ], ],
        projectIds: [ [] as number[], ],
        startDate: [ null as Date | null, ],
        endDate: [ { value: null as Date | null, disabled: true, }, ],
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Subscribe to available projects for the linked-project selector.
        this._projectsService.projects$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(projects => {
                this.projectsList = projects;
            });

        // Load projects from localStorage or projects.json.
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

        // Populate form when editing an existing experience.
        if (
            this.data.mode === 'edit' &&
            this.data.experience
        ) {
            this.populateForm(this.data.experience);
        }

        // Enable endDate only after startDate is selected.
        this.experienceForm.controls.startDate.valueChanges
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(startDate => {
                const endDateControl =
                    this.experienceForm.controls.endDate;

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
     */
    submit(): void {
        if (this.experienceForm.invalid) {
            this.experienceForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.experienceForm.disable();

        const formValue =
            this.experienceForm.getRawValue();

        const request: CreateExperienceRequest = {
            company: formValue.company!,
            jobTitle: formValue.jobTitle!,
            description: formValue.description!,
            employmentType: formValue.employmentType!,
            location: formValue.location!,
            projectIds: formValue.projectIds!,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
        };

        if (
            this.data.mode === 'edit' &&
            this.data.experience
        ) {
            this.updateExperience(
                this.data.experience.id,
                request
            );

            return;
        }

        this.createExperience(request);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fills form with existing experience data
     */
    private populateForm(
        experience: Experience
    ): void {
        this.experienceForm.patchValue({
            company: experience.company,
            jobTitle: experience.jobTitle,
            description: experience.description,
            employmentType: experience.employmentType,
            location: experience.location,
            projectIds: [...experience.projectIds],
            startDate: experience.startDate ? new Date(experience.startDate) : null,
            endDate: experience.endDate? new Date(experience.endDate) : null,
        });

        if (experience.startDate) {
            this.experienceForm.controls.endDate.enable();
        }
    }

    /**
     * Creates new experience
     */
    private createExperience(
        request: CreateExperienceRequest
    ): void {
        this._experiencesService.createExperience(request)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: experience => {
                    this._snackbarService.success(
                        `"${experience.company}" was created successfully.`, 
                        'New Experience Created'
                    );
                    this._dialogRef.close(experience);
                },
                error: error => {
                    console.error('Failed to create project:', error);
                    this._snackbarService.error(
                        'The experience could not be added. Please try again.', 
                        'Create Failed'
                    );
                    this.restoreForm();
                },
            });
    }

    /**
     * Updates existing experience
     */
    private updateExperience(
        experienceId: number,
        request: UpdateExperienceRequest
    ): void {
        this._experiencesService.updateExperience(experienceId, request)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: experience => {
                    this._snackbarService.success(
                        `"${experience.company}" was updated successfully.`, 
                        'Project Updated'
                    );
                    this._dialogRef.close(experience);
                },
                error: error => {
                    console.error('Failed to update experience:', error);
                    this._snackbarService.error(
                        'The experience could not be updated. Please try again.', 
                        'Update Failed'
                    );
                    this.restoreForm();
                },
            });
    }

    /**
     * Restores form after failed submission
     */
    private restoreForm(): void {
        this.isSubmitting = false;
        this.experienceForm.enable();

        // End Date requires a selected Start Date.
        if (!this.experienceForm.controls.startDate.value) {
            this.experienceForm.controls.endDate.disable();
        }
    }

}