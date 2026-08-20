import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/user/user.service';
import { NoticeDialogService } from '../../core/services/notice-dialog.service';

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
    private readonly _noticeService = inject(NoticeDialogService)

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
     * Displays work-in-progress notice for notifications
     */
    openNotifications(): void {
        this._noticeService.open();
    }

    /**
     * Displays work-in-progress notice for settings
     */
    openSettings(): void {
        this._noticeService.open();
    }

}