import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, UserCredentialsRecord  } from './auth.model';
import { environment } from '../../../environments/environment';

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

    private readonly _usersUrl = `${environment.apiUrl}/users.json`;
    private readonly _accessTokenKey = 'accessToken';
    private readonly _refreshTokenKey = 'refreshToken';
    private readonly _userIdKey = 'userId';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns whether the user is authenticated
     */
    get authenticated(): boolean {
        return Boolean(this.accessToken);
    }

    /**
     * Returns the current access token
     */
    get accessToken(): string | null {
        return localStorage.getItem(this._accessTokenKey);
    }

    /**
     * Returns the current signed-in user ID
     */
    get userId(): number | null {
        const userId = localStorage.getItem(this._userIdKey);
        if (!userId) {
            return null;
        }
        const parsedUserId = Number(userId);
        return Number.isNaN(parsedUserId) ? null : parsedUserId;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Signs in using the demo user data
     * @param request
     */
    signIn(
        request: LoginRequest
    ): Observable<LoginResponse> {
        return this._httpClient.get<UserCredentialsRecord[]>(this._usersUrl)
        .pipe(
            delay(800),
            map(users => {
                const user = users.find(item =>
                    item.email === request.email &&
                    item.password === request.password
                );
                if (!user) {
                    throw new Error('Invalid email or password.');
                }

                const response: LoginResponse = {
                    accessToken: crypto.randomUUID(),
                    refreshToken: crypto.randomUUID(),
                    expiresIn: 3600,
                    userId: user.id,
                };
                this._saveSession(response);
                return response;
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<boolean> {
        // Remove only Auth but keep changes
        // localStorage.removeItem(this._accessTokenKey);
        // localStorage.removeItem(this._refreshTokenKey);
        // localStorage.removeItem(this._userIdKey);
        // Remove everything
        localStorage.clear();
        return of(true);
    }

    /**
     * Creates a new simulated access token
     */
    refreshToken(): Observable<LoginResponse> {
        const refreshToken = localStorage.getItem(this._refreshTokenKey);
        const userId = this.userId;
        if (!refreshToken || userId === null) {
            throw new Error('No refresh token available.');
        }
        const response: LoginResponse = {
            accessToken: crypto.randomUUID(),
            refreshToken,
            expiresIn: 3600,
            userId,
        };
        return of(response)
        .pipe(
            delay(500),
            map(result => {
                localStorage.setItem(this._accessTokenKey, result.accessToken);
                return result;
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Saves authentication data
     * @param response
     */
    private _saveSession(
        response: LoginResponse
    ): void {
        localStorage.setItem(this._accessTokenKey, response.accessToken);
        localStorage.setItem(this._refreshTokenKey, response.refreshToken);
        localStorage.setItem(this._userIdKey, response.userId.toString());
    }
  
}
