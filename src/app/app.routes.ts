import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import { SignInComponent } from './modules/auth/sign-in/sign-in.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { ProjectsComponent } from './modules/admin/projects/projects.component';
import { ExperiencesComponent } from './modules/admin/experiences/experiences.component';
import { SkillsComponent } from './modules/admin/skills/skills.component';
import { ContactsComponent } from './modules/admin/contacts/contacts.component';
import { ProfileComponent } from './modules/admin/profile/profile.component';
import { CryptekLabComponent } from './modules/admin/cryptek-lab/cryptek-lab.component';
import { CertificatesComponent } from './modules/admin/certificates/certificates.component';

export const routes: Routes = [

    // -----------------------------------------------------------------------------------------------------
    // @ Redirect routes
    // -----------------------------------------------------------------------------------------------------

    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },

    { 
        path: 'signed-in-redirect', 
        pathMatch: 'full', 
        redirectTo: 'dashboard' 
    },

    // -----------------------------------------------------------------------------------------------------
    // @ Guest routes
    // -----------------------------------------------------------------------------------------------------

    {
        path: 'sign-in',
        component: SignInComponent
    },

    // -----------------------------------------------------------------------------------------------------
    // @ Authenticated routes
    // -----------------------------------------------------------------------------------------------------

    {
        path: '',
        component: MainLayoutComponent,
        canActivateChild: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'projects',
                component: ProjectsComponent,
            },
            {
                path: 'experiences',
                component: ExperiencesComponent,
            },
            {
                path: 'skills',
                component: SkillsComponent,
            },
            {
                path: 'certificates',
                component: CertificatesComponent,
            },
            {
                path: 'contacts',
                component: ContactsComponent,
            },
            {
                path: 'cryptek-lab',
                component: CryptekLabComponent,
            },

            {
                path: 'profile',
                component: ProfileComponent,
            },

        ]
    },

    // -----------------------------------------------------------------------------------------------------
    // @ Fallback route
    // -----------------------------------------------------------------------------------------------------

    {
        path: '**',
        redirectTo: 'dashboard'
    }

];