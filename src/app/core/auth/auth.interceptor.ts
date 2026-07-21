import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
    // Get access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // Check if access token missing
    if(!accessToken) {
        return next(req)
    }

    // Clone request and add access token
    const authRequest = req.clone({
        setHeaders : {
            Authorization : `Bearer ${accessToken}`
        }
    });

    // Return modified request
    return next(authRequest)

}