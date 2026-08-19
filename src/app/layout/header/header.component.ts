import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/user/user.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    imports: [
        AsyncPipe,
    ],
})

export class HeaderComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Outputs
    // -----------------------------------------------------------------------------------------------------

    @Output()

    menuClicked = new EventEmitter<void>();

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly currentUser$ = this._userService.currentUser$;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the mobile navigation menu
     */
    onMenuClick(): void {
        this.menuClicked.emit();
    }

    /**
     * Navigates to the profile page
     */
    openProfile(): void {
        this._router.navigate(['/profile']);
    }

    /**
     * Opens notifications
     */
    openNotifications(): void {
        console.log("Notification not implemented yet");
        
    }

    /**
     * Navigates to settings
     */
    openSettings(): void {
        console.log("Settings not implemented yet");
        // this._router.navigate(['/settings']);
    }

}