import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SKILL_CATEGORIES, SKILL_LEVELS, SKILL_TYPES } from '../../../../core/skills/skills.constants';
import {
    CreateSkillRequest,
    Skill,
    SkillCategory,
    SkillLevel,
    SkillType,
    UpdateSkillRequest,
} from '../../../../core/skills/skills.model';
import { SkillsService } from '../../../../core/skills/skills.service';
import { Project } from '../../../../core/projects/projects.model';
import { ProjectsService } from '../../../../core/projects/projects.service';

export type DetailsSkillsMode = 'create' | 'edit';

export interface DetailsSkillsDialogData {
    mode: DetailsSkillsMode;
    skill?: Skill;
}

@Component({
    selector: 'app-details-skills',
    standalone: true,
    templateUrl: './details-skills.component.html',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
})

export class DetailsSkillsComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _formBuilder = inject(FormBuilder);
    private readonly _skillsService = inject(SkillsService);
    private readonly _projectsService = inject(ProjectsService);
    private readonly _dialogRef = inject(MatDialogRef<DetailsSkillsComponent>);

    readonly data = inject<DetailsSkillsDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly skillCategories = SKILL_CATEGORIES;
    readonly skillTypes = SKILL_TYPES;
    readonly skillLevels = SKILL_LEVELS;

    projectsList: Project[] = [];

    isSubmitting = false;

    readonly skillForm =
        this._formBuilder.group({
            name: ['', [ Validators.required, Validators.maxLength(100), ], ],
            icon: ['', [ Validators.maxLength(100), ], ],
            description: [ '', [ Validators.required, Validators.maxLength(500), ], ],
            category: [ null as SkillCategory | null, Validators.required, ],
            type: [ null as SkillType | null, Validators.required, ],
            level: [ null as SkillLevel | null, Validators.required, ],
            experienceMonths: [ 0, [ Validators.required, Validators.min(0), Validators.max(600), ], ],
            projectIds: [ [] as number[], ],
        });

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.loadProjects();
        if (this.data.mode === 'edit' && this.data.skill) {
            this.populateForm(this.data.skill);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Closes the dialog without saving.
     */
    cancel(): void {
        this._dialogRef.close();
    }

    /**
     * Creates or updates the skill.
     */
    submit(): void {
        if (this.skillForm.invalid) {
            this.skillForm.markAllAsTouched();
            return;
        }
        this.isSubmitting = true;
        this.skillForm.disable();
        const formValue = this.skillForm.getRawValue();
        const request: CreateSkillRequest = {
            name: formValue.name!,
            icon: formValue.icon?.trim() ?? '',
            description: formValue.description!,
            category: formValue.category!,
            type: formValue.type!,
            level: formValue.level!,
            experienceMonths: formValue.experienceMonths ?? 0,
            projectIds: formValue.projectIds ?? [],
        };
        if (this.data.mode === 'edit' && this.data.skill) {
            this.updateSkill(
                this.data.skill.id,
                request
            );
            return;
        }
        this.createSkill(request);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads projects for the related-project selector.
     */
    private loadProjects(): void {
        this._projectsService.getProjects()
            .subscribe({
                next: projects => {
                    this.projectsList = projects;
                },
                error: error => {
                    console.error('Failed to load projects:', error);
                },
            });
    }

    /**
     * Populates the form when editing.
     */
    private populateForm(skill: Skill): void {
        this.skillForm.patchValue({
            name: skill.name,
            icon: skill.icon,
            description: skill.description,
            category: skill.category,
            type: skill.type,
            level: skill.level,
            experienceMonths: skill.experienceMonths,
            projectIds: [ ...skill.projectIds, ],
        });
    }

    /**
     * Creates a new skill.
     */
    private createSkill(
        request: CreateSkillRequest
    ): void {
        this._skillsService.createSkill(request)
            .subscribe({
                next: skill => {
                    this._dialogRef.close(skill);
                },
                error: error => {
                    console.error('Failed to create skill:', error);
                    this.restoreForm();
                },
            });
    }

    /**
     * Updates an existing skill.
     */
    private updateSkill(
        skillId: number,
        request: UpdateSkillRequest
    ): void {
        this._skillsService.updateSkill(skillId, request)
            .subscribe({
                next: skill => {
                    this._dialogRef.close(skill);
                },
                error: error => {
                    console.error('Failed to update skill:', error);
                    this.restoreForm();
                },
            });
    }

    /**
     * Restores the form after an error.
     */
    private restoreForm(): void {
        this.isSubmitting = false;
        this.skillForm.enable();
    }

}