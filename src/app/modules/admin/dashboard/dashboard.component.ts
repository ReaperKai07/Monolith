import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProjectsService } from '../../../core/projects/projects.service';
import { ExperiencesService } from '../../../core/experiences/experiences.service';
import { SkillsService } from '../../../core/skills/skills.service';
import { CertificatesService } from '../../../core/certificates/certificates.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';
import { Project, ProjectUpdate, ProjectUpdateType } from '../../../core/projects/projects.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Experience } from '../../../core/experiences/experiences.model';

type UpdateType = 'Added' | 'Updated' | 'Deleted';

interface RecentUpdate {
    id: number;
    type: UpdateType;
    comment: string;
    createdAt: Date;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    imports: [
        MatIconModule,
        MatListModule,
        DatePipe,
        NgClass
    ],
})

export class DashboardComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

        private readonly _projectsService = inject(ProjectsService);
        private readonly _experiencesService = inject(ExperiencesService);
        private readonly _skillsService = inject(SkillsService);
        private readonly _certificatesService = inject(CertificatesService);
        private readonly _userService = inject(UserService);
        private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly activeProjectId = 5;
    readonly today = new Date();

    currentUser: User | null = null;
    activeProject: Project | null = null;

    projectCount = 0;
    experienceYears = 0;
    skillCount = 0;
    certificateCount = 0;

    recentUpdates: ProjectUpdate[] = [];

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._subscribeToDashboardData();
        this._initializeDashboardData();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns the user's first name for the welcome message
     */
    get displayName(): string {
        return this.currentUser?.name.trim().split(' ')[0] ?? 'User';
    }

    /**
     * Returns the active project progress
     */
    get activeProjectProgress(): number {
        if (!this.activeProject) {
            return 0;
        }
        if (this.activeProject.status === 'Completed') {
            return 100;
        }
        const completedFeatures = this.activeProject.features.length;
        if (completedFeatures === 0) {
            return 10;
        }
        return Math.min(90, completedFeatures * 10);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Project update methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns styling for each project update type
     * @param type
     */
    getUpdateTypeClasses(
        type: ProjectUpdateType
    ): string {
        switch (type) {
            case 'Feature':
                return 'bg-green-100 text-green-700';

            case 'Improvement':
                return 'bg-blue-100 text-blue-700';

            case 'Bug Fix':
                return 'bg-red-100 text-red-700';

            case 'Refactor':
                return 'bg-violet-100 text-violet-700';

            case 'Documentation':
                return 'bg-amber-100 text-amber-700';

            case 'Release':
                return 'bg-stone-800 text-white';

            case 'Maintenance':
                return 'bg-stone-200 text-stone-700';

            default:
                return 'bg-stone-100 text-stone-700';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Subscribes to data exposed by the application services
     */
    private _subscribeToDashboardData(): void {
        
        this._userService.currentUser$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(user => {
                this.currentUser = user;

            });

        this._projectsService.projects$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(projects => {
                this.projectCount = projects.length;
                this.activeProject = projects.find(project => project.id === this.activeProjectId) ?? null;
            });

        this._experiencesService.experiences$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(experiences => {
                this.experienceYears = this._calculateExperienceYears(experiences);
            });

        this._skillsService.skills$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(skills => {
                this.skillCount = skills.length;
            });

        this._certificatesService.certificates$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(certificates => {
                this.certificateCount = certificates.length;
            });

        this._projectsService.projectUpdates$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(updates => {
                this.recentUpdates = updates.slice(0, 5);
            });
    }

    /**
     * Loads the initial dashboard data
     */
    private _initializeDashboardData(): void {
        
        this._userService.initializeCurrentUser()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize user:', error);
                },
            });

        this._projectsService.initializeProjects()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize projects:', error);
                },
            });

        this._projectsService.getProjectUpdates(this.activeProjectId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: updates => {
                    this.recentUpdates = updates.slice(0, 5);
                },
                error: error => {
                    console.error('Failed to initialize project updates:', error);
                },
            });

        this._experiencesService.initializeExperiences()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize experiences:', error);
                },
            });

        this._skillsService.initializeSkills()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error('Failed to initialize skills:', error);
                },
            });

        this._certificatesService.initializeCertificates()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize certificates:', error);
                },
            });
    }

    /**
     * Calculates years from the earliest experience start date
     * @param experiences
     */
    private _calculateExperienceYears(
        experiences: Experience[]
    ): number {
        const startDates = experiences
            .map(experience => experience.startDate)
            .filter(
                (date): date is Date => date instanceof Date
            );
        if (startDates.length === 0) {
            return 0;
        }
        const earliestStartDate =
            new Date(
                Math.min(
                    ...startDates.map(
                        date => date.getTime()
                    )
                )
            );
        const currentDate = new Date();
        let years = currentDate.getFullYear() - earliestStartDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const startMonth = earliestStartDate.getMonth();
        if ( currentMonth < startMonth || ( currentMonth === startMonth && currentDate.getDate() < earliestStartDate.getDate() )) {
            years--;
        }
        return Math.max(0, years);
    }

}
