import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    imports: [
        DatePipe,
    ],
})
export class ProfileComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _userService = inject(UserService);
    private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    currentUser: User | null = null;

    failedProfileImage = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to the current signed-in user.
         */
        this._userService.currentUser$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(user => {
                this.currentUser = user;
            });

        /*
         * Restore the signed-in user when the page
         * is opened directly or refreshed.
         */
        this._userService.initializeCurrentUser()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize profile:', error);
                },
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Records a failed profile image load.
     */
    onProfileImageError(): void {
        this.failedProfileImage = true;
    }

}