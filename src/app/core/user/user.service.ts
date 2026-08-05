import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    delay,
    map,
    Observable,
    of,
    tap,
    throwError,
} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UpdateUserRequest, User } from './user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class UserService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);
    private readonly _authService = inject(AuthService);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _usersUrl = `${environment.apiUrl}/users.json`; 
    private readonly _storageKey = 'monolith_users';
    private readonly _currentUser = new BehaviorSubject<User | null>(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns the current signed-in user as an observable
     */
    get currentUser$(): Observable<User | null> {
        return this._currentUser.asObservable();
    }

    /**
     * Returns the current signed-in user value
     */
    get currentUser(): User | null {
        return this._currentUser.value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Restores the current user after page refresh
     */
    initializeCurrentUser(): Observable<User | null> {
        const userId = this._authService.userId;
        if (userId === null) {
            this.clearCurrentUser();
            return of(null);
        }
        return this.getUserDetails(userId);
    }

    /**
     * Returns the complete user record by ID
     * @param userId
     */
    getUserDetails(
        userId: number
    ): Observable<User> {
        return this._loadUsers()
        .pipe(
            delay(500),
            map(users => {
                const user = users.find(item => item.id === userId);
                if (!user) {
                    throw new Error(`User with ID ${userId} was not found.`);
                }
                return user;
            }),
            tap(user => {
                this._currentUser.next(user);
            })
        );
    }

    /**
     * Updates the current user profile
     * @param userId
     * @param request
     */
    updateUser(
        userId: number,
        request: UpdateUserRequest
    ): Observable<User> {
        return this._loadUsers()
        .pipe(
            map(users => {
                const userIndex = users.findIndex(user => user.id === userId);
                if (userIndex === -1) {
                    throw new Error(`User with ID ${userId} was not found.`);
                }
                const existingUser = users[userIndex];
                const updatedUser: User = {
                    ...existingUser,
                    ...request,
                    id: userId,
                    profile: {
                        ...existingUser.profile,
                        ...request.profile,
                    },
                    education:
                        request.education ??
                        existingUser.education,
                    platforms:
                        request.platforms ??
                        existingUser.platforms,
                };
                const updatedUsers = [
                    ...users,
                ];
                updatedUsers[userIndex] = updatedUser;
                this._saveUsers(updatedUsers);
                this._currentUser.next(updatedUser);
                return updatedUser;
            })
        );
    }

    /**
     * Clears the current signed-in user
     */
    clearCurrentUser(): void {
        this._currentUser.next(null);
    }

    /**
     * Clears saved profile changes and reloads users.json
     */
    resetUserData(): Observable<User[]> {
        localStorage.removeItem(this._storageKey);
        return this._loadSeedUsers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads users from localStorage, or seeds them from users.json
     */
    private _loadUsers(): Observable<User[]> {
        const storedUsers = localStorage.getItem(this._storageKey);
        if (storedUsers) {
            try {
                return of(JSON.parse(storedUsers) as User[]);
            } catch {
                localStorage.removeItem(this._storageKey);
            }
        }
        return this._loadSeedUsers();
    }

    /**
     * Loads the initial users data from users.json
     */
    private _loadSeedUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>(this._usersUrl)
        .pipe(
            tap(users => {
                this._saveUsers(users);
            })
        );
    }

    /**
     * Saves users to localStorage
     * @param users
     */
    private _saveUsers(
        users: User[]
    ): void {
        localStorage.setItem(this._storageKey, JSON.stringify(users));
    }

}