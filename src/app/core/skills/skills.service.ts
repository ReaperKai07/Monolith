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
import { CreateSkillRequest, Skill, UpdateSkillRequest } from './skills.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class SkillsService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _skillsUrl = `${environment.apiUrl}/skills.json`;
    private readonly _storageKey = 'monolith_skills';
    private readonly _skills = new BehaviorSubject<Skill[]>([]);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Observable containing the current skills data.
     */
    get skills$(): Observable<Skill[]> {
        return this._skills.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads saved skills or seeds them from skills.json.
     */
    initializeSkills(): Observable<Skill[]> {
        const storedSkills = localStorage.getItem(this._storageKey);
        if (storedSkills) {
            try {
                const skills = JSON.parse(storedSkills) as Skill[];
                this._skills.next(skills);
                return of(skills);
            } catch {
                localStorage.removeItem(this._storageKey);
            }
        }
        return this._loadSeedSkills();
    }

    /**
     * Returns all skills.
     */
    getSkills(): Observable<Skill[]> {
        if (this._skills.value.length > 0) {
            return of(this._skills.value);
        }
        return this.initializeSkills();
    }

    /**
     * Returns a skill by ID.
     */
    getSkillById(skillId: number): Observable<Skill> {
        return this.getSkills().pipe(
            switchMap(skills => {
                const skill = skills.find(item => item.id === skillId);
                if (!skill) {
                    return throwError(() =>
                        new Error(`Skill with ID ${skillId} was not found.`)
                    );
                }
                return of(skill);
            })
        );
    }

    /**
     * Creates a new skill.
     */
    createSkill(
        request: CreateSkillRequest
    ): Observable<Skill> {
        return this.getSkills().pipe(
            map(skills => {
                const newSkill: Skill = {
                    ...request,
                    id: this._generateNextId(skills),
                };
                const updatedSkills = [
                    ...skills,
                    newSkill,
                ];
                this._saveSkills(updatedSkills);
                return newSkill;
            })
        );
    }

    /**
     * Updates an existing skill.
     */
    updateSkill(
        skillId: number,
        request: UpdateSkillRequest
    ): Observable<Skill> {
        return this.getSkills().pipe(
            switchMap(skills => {
                const skillIndex = skills.findIndex(skill => skill.id === skillId);
                if (skillIndex === -1) {
                    return throwError(() =>
                        new Error(`Skill with ID ${skillId} was not found.`)
                    );
                }
                const updatedSkill: Skill = {
                    ...skills[skillIndex],
                    ...request,
                    id: skillId,
                };
                const updatedSkills = [
                    ...skills,
                ];
                updatedSkills[skillIndex] = updatedSkill;
                this._saveSkills(updatedSkills);
                return of(updatedSkill);
            })
        );
    }

    /**
     * Deletes a skill by ID.
     */
    deleteSkill(skillId: number): Observable<boolean> {
        return this.getSkills().pipe(
            switchMap(skills => {
                const skillExists = skills.some(skill => skill.id === skillId);
                if (!skillExists) {
                    return throwError(() =>
                        new Error(`Skill with ID ${skillId} was not found.`)
                    );
                }
                const updatedSkills = skills.filter(skill => skill.id !== skillId);
                this._saveSkills(updatedSkills);
                return of(true);
            })
        );
    }

    /**
     * Clears saved changes and restores skills.json.
     */
    resetSkills(): Observable<Skill[]> {
        localStorage.removeItem(this._storageKey);
        return this._loadSeedSkills();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads the initial skills data from skills.json.
     */
    private _loadSeedSkills(): Observable<Skill[]> {
        return this._httpClient
            .get<Skill[]>(this._skillsUrl)
            .pipe(
                tap(skills => {
                    this._saveSkills(skills);
                })
            );
    }

    /**
     * Saves skills and publishes the updated data.
     */
    private _saveSkills(skills: Skill[]): void {
        localStorage.setItem(this._storageKey, JSON.stringify(skills));
        this._skills.next(skills);
    }

    /**
     * Generates the next available skill ID.
     */
    private _generateNextId(skills: Skill[]): number {
        if (skills.length === 0) {
            return 1;
        }
        return Math.max(
            ...skills.map(skill => skill.id)
        ) + 1;
    }

}