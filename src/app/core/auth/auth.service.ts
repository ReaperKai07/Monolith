import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, SignInResponse } from './auth.model';

@Injectable({ 
    providedIn: 'root' 
})

export class AuthService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly accessTokenKey = 'accessToken';
    private readonly refreshTokenKey = 'refreshToken';
    private readonly userIdKey = 'userId';

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
        const id = localStorage.getItem(this.userIdKey);
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
        .get<SignInResponse[]>('/assets/data/users.json')
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
                    // Generate random UUIDs for access tokens
                    accessToken: crypto.randomUUID(),
                    // Generate random UUIDs for refresh tokens
                    refreshToken: crypto.randomUUID(),
                    // Set expiration time to 1 hour (3600 seconds)
                    expiresIn: 3600,
                    // Set user ID
                    userId: user.id
                };

                localStorage.setItem(this.accessTokenKey, response.accessToken);
                localStorage.setItem(this.refreshTokenKey, response.refreshToken);
                localStorage.setItem(this.userIdKey, response.userId.toString());

                return response;
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<boolean> {
        // localStorage.removeItem(this.accessTokenKey);
        // localStorage.removeItem(this.refreshTokenKey);
        // localStorage.removeItem(this.userIdKey);
        localStorage.clear();
        return of(true);
    }

    /**
     * 
     * @returns 
     */
    refreshToken(): Observable<LoginResponse>{

        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        const userId = localStorage.getItem(this.userIdKey);

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
