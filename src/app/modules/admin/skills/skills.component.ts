import { NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule} from '@angular/material/tooltip';
import { SKILL_CATEGORIES, SKILL_LEVEL_VALUES } from '../../../core/skills/skills.constants';
import { Skill, SkillCategory } from '../../../core/skills/skills.model';
import { SkillsService } from '../../../core/skills/skills.service';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ProjectsService } from '../../../core/projects/projects.service';
import { Project } from '../../../core/projects/projects.model';
import { DetailsSkillsComponent, DetailsSkillsDialogData } from './details-skills/details-skills.component';

type SkillCategoryFilter = 'All' | SkillCategory;

interface SkillGroup {
    category: SkillCategory;
    skills: Skill[];
}

@Component({
    selector: 'app-skills',
    standalone: true,
    templateUrl: './skills.component.html',
    imports: [
        NgClass,
        MatTooltipModule,
        SearchComponent,
        NgClass,
        SlicePipe,
    ],
})

export class SkillsComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _skillsService = inject(SkillsService);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _projectsService = inject(ProjectsService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly skillCategories = SKILL_CATEGORIES;

    selectedCategory: SkillCategoryFilter = 'All';
    searchTerm = '';

    skillsList: Skill[] = [];
    projectsList: Project[] = [];

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to the skills service
         */
        this._skillsService.skills$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(skills => {
                this.skillsList = skills;
            });

        /*
         * Load skills from localStorage, or seed them from skills.json
         */
        this._skillsService
            .initializeSkills()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error('Failed to initialize skills:', error);
                },
            });

        /**
         * Subscribe to the project service
         */
        this._projectsService.projects$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(projects => {
                this.projectsList = projects;
            });

        /**
         * Load projects from localStorage, or seed them from projects.json
         */
        this._projectsService.initializeProjects()
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
     * Returns skills matching the search and category filters.
     */
    get filteredSkills(): Skill[] {
        const search = this.searchTerm.trim().toLowerCase();
        return this.skillsList.filter(skill => {
            const matchesCategory = this.selectedCategory === 'All' || skill.category === this.selectedCategory;
            if (!matchesCategory) {
                return false;
            }
            if (!search) {
                return true;
            }
            const searchableValues = [
                skill.name,
                skill.description,
                skill.category,
                skill.type,
                skill.level,
            ];
            return searchableValues.some(value =>
                value.toLowerCase().includes(search)
            );
        });
    }

    /**
     * Groups filtered skills by category.
     */
    get skillGroups(): SkillGroup[] {
        return this.skillCategories
            .map(category => ({
                category,
                skills: this.filteredSkills.filter(skill => skill.category === category),
            }))
            .filter(group => group.skills.length > 0);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the create skill dialog.
     */
    openCreateDialog(): void {
        this._openDetailsDialog({
            mode: 'create',
        });
    }

    /**
     * Opens the edit skill dialog.
     * @param skill
     */
    openEditDialog(skill: Skill): void {
        this._openDetailsDialog({
            mode: 'edit',
            skill,
        });
    }

    /**
     * Opens the delete confirmation dialog.
     * @param skill
     */
    openDeleteDialog(skill: Skill): void {
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
                    itemName: skill.name,
                    itemType: 'skill',
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

                this.deleteSkill(skill.id);
            });
    }

    /**
     * Deletes a skill by ID.
     * @param skillId
     */
    deleteSkill(skillId: number): void {
        this._skillsService
            .deleteSkill(skillId)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error(
                        'Failed to delete skill:',
                        error
                    );
                },
            });
    }

    /**
     * Returns project names linked to the provided IDs.
     * @param projectIds
     */
    getProjectNames(projectIds: number[]): string[] {
        return this.projectsList
            .filter(project =>
                projectIds.includes(project.id)
            )
            .map(project => project.project);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the shared create and edit skill dialog.
     * @param data
     */
    private _openDetailsDialog(
        data: DetailsSkillsDialogData
    ): void {
        this._dialog.open<
            DetailsSkillsComponent,
            DetailsSkillsDialogData,
            Skill
        >(
            DetailsSkillsComponent,
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
    // @ Category filter methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates the selected skill category.
     * @param category
     */
    selectCategory(
        category: SkillCategoryFilter
    ): void {
        this.selectedCategory = category;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Search methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates the current search term.
     * @param searchTerm
     */
    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Skill display methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns the numeric value of a skill level.
     * @param skill
     */
    getSkillLevelValue(skill: Skill): number {
        return SKILL_LEVEL_VALUES[skill.level];
    }

    /**
     * Formats skill experience into years and months.
     * @param months
     */
    formatExperience(months: number): string {
        if (months <= 0) {
            return 'No experience recorded';
        }
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years === 0) {
            return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
        }
        if (remainingMonths === 0) {
            return `${years} ${years === 1 ? 'year' : 'years'}`;
        }
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    }

}