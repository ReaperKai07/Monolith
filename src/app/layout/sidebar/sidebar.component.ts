import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

// navigation item model
interface NavigationItem {
    title: string;
    route: string;
    icon: 'dashboard' | 'projects' | 'experiences' | 'skills' | 'contacts';
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    imports: [
        RouterLink,
        RouterLinkActive,
    ],
})

export class SidebarComponent {

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

    // Define navigation items for sidebar
    navigationItems: NavigationItem[] = [
        {
            title: 'Dashboard',
            route: '/dashboard',
            icon: 'dashboard'
        },
        {
            title: 'Projects',
            route: '/projects',
            icon: 'projects'
        },
        {
            title: 'Experiences',
            route: '/experiences',
            icon: 'experiences'
        },
        {
            title: 'Skills',
            route: '/skills',
            icon: 'skills'
        },
        {
            title: 'Contacts',
            route: '/contacts',
            icon: 'contacts'
        }
    ];

    // Sign out method to handle user sign-out
    signOut(): void {
        this._authService.signOut().subscribe(() => {
            // Delay 1 second to simulate BE, then navigate to sign-in
            setTimeout(() => {
                this._router.navigate(['/sign-in']);
            }, 1000); 
        });
    }

}
