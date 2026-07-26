import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    delay,
    map,
    Observable,
    of,
    tap
} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserDetailsResponse, UserProfile } from './user.model';

@Injectable({
    providedIn: 'root'
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

    private readonly _currentUser = new BehaviorSubject<UserProfile | null>(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly currentUser$ = this._currentUser.asObservable();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get user details by ID
     * @param id 
     * @returns 
     */
    getUserDetails(id: number): Observable<UserProfile> {
        return this._httpClient
            .get<UserDetailsResponse[]>('/assets/data/users.json')
            .pipe(
                delay(500),
                map(users => {
                    
                    // Find user by ID
                    const user = users.find(item => item.id === id);
                    
                    if (!user) {
                        throw new Error('User not found');
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                }),

                // Update current user
                tap(user => this._currentUser.next(user))
            );
    }

    /**
     * Restore current user after page refresh
     */
    initializeCurrentUser(): Observable<UserProfile | null> {
        const userId = this._authService.userId;

        if (userId === null) {
            this._currentUser.next(null);
            return of(null);
        }

        return this.getUserDetails(userId);
    }

    /**
     * Clear current user
     */
    clearCurrentUser(): void {
        this._currentUser.next(null);
    }

}
