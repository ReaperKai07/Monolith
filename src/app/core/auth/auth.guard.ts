import { inject } from '@angular/core';
import { CanActivateChildFn , Router } from '@angular/router';
import { AuthService } from './auth.service';


export const authGuard: CanActivateChildFn  = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    /**
     * Allow access if user authenticated
     */
    if (authService.authenticated) {
        return true;
    }

    /**
     * Redirect unauthenticated users to sign-in
     * Store requested URL page, restored after login
     */
    return router.createUrlTree(
        ['/sign-in'],
        {
            queryParams: {
                redirectURL: state.url
            }
        }
    );

};