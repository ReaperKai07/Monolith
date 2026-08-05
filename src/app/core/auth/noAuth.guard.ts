import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const noAuthGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    /*
     * Allow access when the user is not authenticated.
     */
    if (!authService.authenticated) {
        return true;
    }

    /*
     * Prevent authenticated users from returning to Sign In.
     */
    return router.createUrlTree([
        '/dashboard',
    ]);

};