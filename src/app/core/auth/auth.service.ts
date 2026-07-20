import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from './auth.model';

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
   * Data refer to src/assets/data/users.json
   * @param request 
   * @returns 
   */
  signIn(request: LoginRequest): Observable<LoginResponse>{
    return this.http.get<any[]>('/assets/data/users.json').pipe(
      delay(800),
      map(users => {
        // Check login if found
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
          accessToken : crypto.randomUUID(),
          refreshToken : crypto.randomUUID(),
          expiresIn : 3600,
          user : {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role,
          }
        };
      })
    );
  }

  /**
   * Get User by id
   */
  
}
