import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, UserProfile } from './auth.model';

export interface SignInCredentials {
    email: string;
    password: string;
}

@Injectable({ 
    providedIn: 'root' 
})

export class AuthService {

    private readonly http = inject(HttpClient);

    /**
     * Sign In
     * @param request 
     * @returns 
     */
    signIn(request: LoginRequest): Observable<LoginResponse>{
        return this.http.get<any[]>('/assets/data/users.json')
        .pipe(
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

                // Return response
                return {
                    accessToken: crypto.randomUUID(),
                    refreshToken: crypto.randomUUID(),
                    expiresIn: 3600,
                    userId: user.id
                };
            })
        );
    }


    /**
     * Get User
     * @param id 
     * @returns 
     */
    getUserDetails(id: number): Observable<UserProfile> {
        return this.http.get<any[]>('/assets/data/users.json')
        .pipe(
            delay(500),
            map(users => {

                // Find user id
                const user = users.find(u => u.id === id);

                // Throw error
                if (!user) {
                    throw new Error('User not found');
                }

                // Return response
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            })
        );
    }
  
}
