import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // Allow access if authenticated
    if (authService.authenticated) {
        return true;
    }

    // Redirect to sign-in and remember requested URL
    return router.createUrlTree(
        ['/sign-in'],
        {
            queryParams: {
                redirectURL: state.url
            }
        }
    );

};