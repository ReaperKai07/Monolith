import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { SignInComponent } from './modules/auth/sign-in/sign-in.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [

    // Redirect empty path
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },

    // Redirect signed-in user
    { 
        path: 'signed-in-redirect', 
        pathMatch: 'full', 
        redirectTo: 'dashboard' 
    },

    // Routes for guest sign-in
    {
        path: 'sign-in',
        component: SignInComponent
    },

    // Admin routes
    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            }
        ]
    },

    // Redirect unknown URL
    {
        path: '**',
        redirectTo: 'sign-in'
    },

];