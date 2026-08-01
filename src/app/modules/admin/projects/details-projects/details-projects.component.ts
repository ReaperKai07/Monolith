import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { 
    CreateProjectRequest,
    Project,
    ProjectPlatform,
    ProjectStatus,
    ProjectType,
    UpdateProjectRequest,
} from '../../../../core/projects/projects.model';
import { ProjectsService } from '../../../../core/projects/projects.service';

export type DetailsProjectsMode =
    | 'create'
    | 'edit';

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

    readonly data = inject<DetailsProjectsDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly projectTypes: ProjectType[] = [
        'Website',
        'Mobile',
    ];

    readonly projectPlatforms: ProjectPlatform[] = [
        'Desktop',
        'Android',
        'iOS',
    ];

    readonly projectStatuses: ProjectStatus[] = [
        'Planning',
        'In Development',
        'On Hold',
        'Completed',
    ];

    readonly availableTechnologies = [
        'Angular',
        'React',
        'TypeScript',
        'Tailwind',
        'RxJS',
        'Ionic',
        'Capacitor',
    ];

    readonly availableScopes = [
        'Frontend',
        'Backend',
        'UI/UX',
        'Mobile',
        'API Integration',
    ];

    isSubmitting = false;

    readonly projectForm =
        this._formBuilder.group({
            project: [ '', [ Validators.required, Validators.maxLength(100), ], ],
            description: [ '', [ Validators.required, Validators.maxLength(500), ], ],
            type: [ null as ProjectType | null, Validators.required, ],
            platform: [ [] as ProjectPlatform[], Validators.required, ],
            technology: [ [] as string[], Validators.required, ],
            scope: [ [] as string[], Validators.required, ],
            startDate: [ null as Date | null, ],
            endDate: [ null as Date | null, ],
            status: [ null as ProjectStatus | null, Validators.required, ],
        });

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        if ( this.data.mode === 'edit' && this.data.project ) {
            this.populateForm(this.data.project);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    cancel(): void {
        this._dialogRef.close();
    }

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
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            status: formValue.status!,
        };
        if ( this.data.mode === 'edit' && this.data.project ) {
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

    private populateForm(project: Project): void {
        this.projectForm.patchValue({
            project: project.project,
            description: project.description,
            type: project.type,
            platform: [...project.platform],
            technology: [...project.technology],
            scope: [...project.scope],
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            status: project.status,
        });
    }

    private createProject(
        request: CreateProjectRequest
    ): void {
        this._projectsService
            .createProject(request)
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

    private updateProject(
        projectId: number,
        request: UpdateProjectRequest
    ): void {
        this._projectsService
            .updateProject(projectId, request)
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

    private restoreForm(): void {
        this.isSubmitting = false;
        this.projectForm.enable();
    }
 
}