import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {

    const authService = inject(AuthService);

    /*
     * Only requests using the configured API URL
     * are treated as backend API requests
     */
    const isApiRequest = request.url.startsWith(environment.apiUrl);

    /*
     * Continue external requests, images, documents
     * and other assets without modification
     */
    if (!isApiRequest) {
        return next(request);
    }

    const accessToken = authService.accessToken;

    /*
     * Continue unchanged when no token exists
     * This allows the sign-in request to load users.json
     */
    if (!accessToken) {
        return next(request);
    }

    /*
     * HTTP requests are immutable
     * Clone the request before adding the Bearer token
     */
    const authenticatedRequest =
        request.clone({
            setHeaders: {
                Authorization:
                    `Bearer ${accessToken}`,
            },
        });

    /*
     * Continue using the authenticated request
     */
    return next(authenticatedRequest);

};