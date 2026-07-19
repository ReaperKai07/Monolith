import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { SignInComponent } from './modules/auth/sign-in/sign-in.component';

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

  // Auth routes for authenticated users
  {
    path: 'sign-in',
    component: SignInComponent
  },

  // Main application
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
  }

];