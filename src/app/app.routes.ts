import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';


export const routes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    children:[
      {
        path:'',
        component:DashboardComponent
      }
    ]
  }

];