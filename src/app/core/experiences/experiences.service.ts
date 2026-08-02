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
    CreateExperienceRequest,
    Experience,
    ExperienceDto,
    UpdateExperienceRequest,
} from './experiences.model';

@Injectable({
    providedIn: 'root',
})

export class ExperiencesService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _storageKey = 'monolith_experiences';
    private readonly _experiencesUrl = '/assets/data/experiences.json';
    private readonly _experiences = new BehaviorSubject<Experience[]>([]);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    readonly experiences$ = this._experiences.asObservable();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads experiences from localStorage or seeds them from JSON.
     */
    initializeExperiences(): Observable<Experience[]> {
        const storedExperiences = localStorage.getItem(this._storageKey);
        if (storedExperiences) {
            try {
                const parsedExperiences = JSON.parse(storedExperiences) as ExperienceDto[];
                const experiences = parsedExperiences.map(experience => this._mapDtoToExperience(experience));
                this._experiences.next(experiences);
                return of(experiences);
            } catch {
                localStorage.removeItem(this._storageKey);
            }
        }
        return this._loadSeedExperiences();
    }

    /**
     * Gets all experiences.
     */
    getExperiences(): Observable<Experience[]> {
        if (this._experiences.value.length > 0) {
            return of(this._experiences.value);
        }
        return this.initializeExperiences();
    }

    /**
     * Gets one experience by ID.
     */
    getExperienceById(
        id: number
    ): Observable<Experience> {
        return this.getExperiences().pipe(
            map(experiences => {
                const experience = experiences.find(item => item.id === id);
                if (!experience) {
                    throw new Error(`Experience with ID ${id} was not found.`);
                }
                return experience;
            })
        );
    }

    /**
     * Creates a new experience.
     */
    createExperience(
        request: CreateExperienceRequest
    ): Observable<Experience> {
        return this.getExperiences().pipe(
            map(experiences => {
                const newExperience: Experience = {
                    ...request,
                    id: this._generateNextId(experiences),
                };
                const updatedExperiences = [
                    ...experiences,
                    newExperience,
                ];
                this._saveExperiences(updatedExperiences);
                return newExperience;
            })
        );
    }

    /**
     * Updates an existing experience.
     */
    updateExperience(
        id: number,
        request: UpdateExperienceRequest
    ): Observable<Experience> {
        return this.getExperiences().pipe(
            switchMap(experiences => {
                const experienceIndex = experiences.findIndex(experience => experience.id === id);
                if (experienceIndex === -1) {
                    return throwError(() =>
                        new Error(`Experience with ID ${id} was not found.`)
                    );
                }
                const updatedExperience: Experience = {
                    ...experiences[experienceIndex],
                    ...request,
                    id,
                };
                const updatedExperiences = [
                    ...experiences,
                ];
                updatedExperiences[experienceIndex] = updatedExperience;
                this._saveExperiences(updatedExperiences);
                return of(updatedExperience);
            })
        );
    }

    /**
     * Deletes an experience by ID.
     */
    deleteExperience(
        id: number
    ): Observable<boolean> {
        return this.getExperiences().pipe(
            switchMap(experiences => {
                const experienceExists = experiences.some(experience => experience.id === id);
                if (!experienceExists) {
                    return throwError(() =>
                        new Error(`Experience with ID ${id} was not found.`)
                    );
                }
                const updatedExperiences = experiences.filter(experience => experience.id !== id);
                this._saveExperiences(updatedExperiences);
                return of(true);
            })
        );
    }

    /**
     * Resets experiences using the original JSON data.
     */
    resetExperiences(): Observable<Experience[]> {
        localStorage.removeItem(this._storageKey);
        return this._loadSeedExperiences();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads the initial experiences JSON data.
     */
    private _loadSeedExperiences(): Observable<Experience[]> {
        return this._httpClient
            .get<ExperienceDto[]>(this._experiencesUrl)
            .pipe(
                map(experiences =>
                    experiences.map(experience => this._mapDtoToExperience(experience))
                ),
                tap(experiences =>
                    this._saveExperiences(experiences)
                )
            );
    }

    /**
     * Saves experiences to localStorage and updates the observable.
     */
    private _saveExperiences(
        experiences: Experience[]
    ): void {
        const experienceDtos = experiences.map(experience => this._mapExperienceToDto(experience));
        localStorage.setItem(this._storageKey, JSON.stringify(experienceDtos));
        this._experiences.next(experiences);
    }

    /**
     * Generates the next available experience ID.
     */
    private _generateNextId(
        experiences: Experience[]
    ): number {
        if (experiences.length === 0) {
            return 1;
        }
        return Math.max(
            ...experiences.map(experience => experience.id)
        ) + 1;
    }

    /**
     * Converts stored date strings into Date objects.
     */
    private _mapDtoToExperience(
        experience: ExperienceDto
    ): Experience {
        return {
            ...experience,
            startDate: experience.startDate ? new Date(experience.startDate) : null,
            endDate: experience.endDate ? new Date(experience.endDate) : null,
        };
    }

    /**
     * Converts Date objects into JSON-safe strings.
     */
    private _mapExperienceToDto(
        experience: Experience
    ): ExperienceDto {
        return {
            ...experience,
            startDate: experience.startDate ? this._formatDate(experience.startDate) : null,
            endDate: experience.endDate ? this._formatDate(experience.endDate) : null,
        };
    }

    /**
     * Formats a date as YYYY-MM-DD.
     */
    private _formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}