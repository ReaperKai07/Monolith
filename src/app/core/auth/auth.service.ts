import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, UserProfile } from './auth.model';

@Injectable({ 
    providedIn: 'root' 
})

export class AuthService {

    private readonly _httpClient = inject(HttpClient);

    private readonly accessTokenKey = 'accessToken';
    private readonly refreshTokenKey = 'refreshToken';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check authentication status
     */
    get authenticated(): boolean {
        return !!localStorage.getItem(this.accessTokenKey);
    }

    /**
     * Cheack access token
     */
    get accessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    /**
     * Check user ID
     */
    get userId(): number | null {
        const id = localStorage.getItem('userId');
        return id ? Number(id) : null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign In
     * @param request 
     * @returns 
     */
    signIn(
        request: LoginRequest
    ): Observable<LoginResponse>{
        return this._httpClient
        .get<any[]>('/assets/data/users.json')
        .pipe(
            // 
            delay(800),
            map(users => {
                
                // Find login info
                const user = users.find(u => 
                    u.email === request.email &&
                    u.password === request.password
                );

                // Throw error
                if(!user) {
                    throw new Error('Invalid email or password');
                }

                // Return body response
                const response = {
                    accessToken: crypto.randomUUID(),
                    refreshToken: crypto.randomUUID(),
                    expiresIn: 3600,
                    userId: user.id
                };

                // Save accessToken
                localStorage.setItem(this.accessTokenKey, response.accessToken);

                // Save userId
                localStorage.setItem('userId', response.userId.toString());

                // Save refreshToken
                localStorage.setItem(this.refreshTokenKey, response.refreshToken);

                // Return
                return response;
            })
        );
    }


    /**
     * Get User
     * @param id 
     * @returns 
     */
    getUserDetails(
        id: number
    ): Observable<UserProfile> {
        return this._httpClient
        .get<any[]>('/assets/data/users.json')
        .pipe(
            delay(500),
            map(users => {

                // Find user id
                const user = users.find(u => u.id === id);

                // Throw error
                if (!user) {
                    throw new Error('User not found');

                }
                // Return body response
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Clear local storage
        localStorage.clear();
        // Return
        return of(true);
    }

    refreshToken(): Observable<LoginResponse>{

        // Get refresh token
        const refreshToken = localStorage.getItem(this.refreshTokenKey);

        // Get user Id
        const userId = localStorage.getItem('userId');

        // No refresh token
        if(!refreshToken || !userId) {
            throw new Error('No refresh token available');
        }

        // Return body response
        return of ({
            accessToken: crypto.randomUUID(),
            refreshToken: refreshToken,
            expiresIn: 3600,
            userId: Number(userId)
        })
        .pipe(
            delay(500),
            map(response => {
                // Save new access token
                localStorage.setItem(this.accessTokenKey, response.accessToken);
                // Return response
                return response;
            })
        )
    }
  
}
