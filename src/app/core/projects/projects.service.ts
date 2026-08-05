import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import {
    CreateProjectRequest,
    Project,
    ProjectDto,
    UpdateProjectRequest,
} from './projects.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class ProjectsService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _storageKey = 'monolith_projects';
    private readonly _projectsUrl = `${environment.apiUrl}/projects.json`;
    private readonly _projects = new BehaviorSubject<Project[]>([]);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    readonly projects$ = this._projects.asObservable();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads projects from localStorage.
     * If localStorage is empty, seed it using projects.json.
     */
    initializeProjects(): Observable<Project[]> {
        const storedProjects = localStorage.getItem(this._storageKey);
        if (storedProjects) {
            try {
                const parsedProjects = JSON.parse(storedProjects) as ProjectDto[];
                const projects = parsedProjects.map(project => this._mapDtoToProject(project));
                this._projects.next(projects);
                return of(projects);
            } catch {
                localStorage.removeItem(this._storageKey);
            }
        }
        return this._loadSeedProjects();
    }

    /**
     * GET /projects
     */
    getProjects(): Observable<Project[]> {
        if (this._projects.value.length > 0) {
            return of(this._projects.value);
        }
        return this.initializeProjects();
    }

    /**
     * GET /projects/:id
     */
    getProjectById(id: number): Observable<Project> {
        return this.getProjects().pipe(
            map(projects => {
                const project = projects.find(item => item.id === id);
                if (!project) {
                    throw new Error(`Project with ID ${id} was not found.`);
                }
                return project;
            })
        );
    }

    /**
     * POST /projects
     */
    createProject(
        request: CreateProjectRequest
    ): Observable<Project> {
        return this.getProjects().pipe(
            map(projects => {
                const newProject: Project = {
                    ...request,
                    id: this._generateNextId(projects),
                };
                const updatedProjects = [
                    ...projects,
                    newProject,
                ];
                this._saveProjects(updatedProjects);
                return newProject;
            })
        );
    }

    /**
     * PUT /projects/:id
     */
    updateProject(
        id: number,
        request: UpdateProjectRequest
    ): Observable<Project> {
        return this.getProjects().pipe(
            switchMap(projects => {
                const projectIndex = projects.findIndex(project => project.id === id);
                if (projectIndex === -1) {
                    return throwError(() =>
                        new Error(`Project with ID ${id} was not found.`)
                    );
                }
                const updatedProject: Project = {
                    ...projects[projectIndex],
                    ...request,
                    id,
                };
                const updatedProjects = [
                    ...projects,
                ];
                updatedProjects[projectIndex] = updatedProject;
                this._saveProjects(updatedProjects);
                return of(updatedProject);
            })
        );
    }

    /**
     * DELETE /projects/:id
     */
    deleteProject(id: number): Observable<boolean> {
        return this.getProjects().pipe(
            switchMap(projects => {
                const projectExists =
                    projects.some(project => project.id === id);
                if (!projectExists) {
                    return throwError(() =>
                        new Error(`Project with ID ${id} was not found.`)
                    );
                }
                const updatedProjects = projects.filter(project => project.id !== id);
                this._saveProjects(updatedProjects);
                return of(true);
            })
        );
    }

    /**
     * Optional development helper.
     * Clears saved changes and reloads projects.json.
     */
    resetProjects(): Observable<Project[]> {
        localStorage.removeItem(this._storageKey);
        return this._loadSeedProjects();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _loadSeedProjects(): Observable<Project[]> {
        return this._httpClient
            .get<ProjectDto[]>(this._projectsUrl)
            .pipe(
                map(projects =>
                    projects.map(project => this._mapDtoToProject(project))
                ),
                tap(projects => this._saveProjects(projects))
            );
    }

    private _saveProjects(
        projects: Project[]
    ): void {
        const projectDtos = projects.map(project => this._mapProjectToDto(project));
        localStorage.setItem(this._storageKey, JSON.stringify(projectDtos));
        this._projects.next(projects);
    }

    private _generateNextId(
        projects: Project[]
    ): number {
        if (projects.length === 0) {
            return 1;
        }
        return Math.max(
            ...projects.map(project => project.id)
        ) + 1;
    }

    private _mapDtoToProject(
        project: ProjectDto
    ): Project {
        return {
            ...project,
            features: project.features ?? [],
            startDate: project.startDate
                ? new Date(project.startDate)
                : null,
            endDate: project.endDate
                ? new Date(project.endDate)
                : null,
        };
    }

    private _mapProjectToDto(
        project: Project
    ): ProjectDto {
        return {
            ...project,
            features: project.features ?? [],
            startDate: project.startDate
                ? this._formatDate(project.startDate)
                : null,
            endDate: project.endDate
                ? this._formatDate(project.endDate)
                : null,
        };
    }

    private _formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}