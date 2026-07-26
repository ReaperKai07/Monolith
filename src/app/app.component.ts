import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { UserService } from './core/user/user.service';
import { LoadingOverlayService } from './core/services/loading-overlay.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoadingOverlayComponent
  ],
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _userService = inject(UserService);
    private readonly _loadingService = inject(LoadingOverlayService);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        // Show loading overlay
        this._loadingService.show();

        // Restore current user
        this._userService
            .initializeCurrentUser()
            .pipe(
                finalize(() => {
                    // Hide loading overlay
                    this._loadingService.hide();
                })
            )
            .subscribe({
                error: error => {
                    console.error('Failed to restore current user', error);
                }
            });
    }
  
}
