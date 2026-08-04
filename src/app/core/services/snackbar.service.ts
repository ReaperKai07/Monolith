import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent, SnackbarData, SnackbarType } from '../../shared/components/snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})

export class SnackbarService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------
    
    private readonly _snackbar = inject(MatSnackBar);

    // -----------------------------------------------------------------------------------------------------
    // @ Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Displays a success snackbar
     * @param message
     * @param title
     */
    success(
        message: string,
        title = 'Success'
    ): void {
        this._open(
            'success',
            title,
            message
        );
    }

    /**
     * Displays an error snackbar
     * @param message
     * @param title
     */
    error(
        message: string,
        title = 'Error'
    ): void {
        this._open(
            'error',
            title,
            message,
            5000 // 5 seconds
        );
    }

    /**
     * Displays a warning snackbar
     * @param message
     * @param title
     */
    warning(
        message: string,
        title = 'Warning'
    ): void {
        this._open(
            'warning',
            title,
            message,
            4500 // 4.5 seconds
        );
    }

    /**
     * Displays an informational snackbar
     * @param message
     * @param title
     */
    info(
        message: string,
        title = 'Information'
    ): void {
        this._open(
            'info',
            title,
            message
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the reusable snackbar component
     */
    private _open(
        type: SnackbarType,
        title: string,
        message: string,
        duration = 3500 // 3.5 seconds
    ): void {
        const data: SnackbarData = {
            type,
            title,
            message,
        };
        const config: MatSnackBarConfig<SnackbarData> = {
            data,
            duration,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: [
                'monolith-snackbar',
            ],
        };
        this._snackbar.openFromComponent(
            SnackbarComponent,
            config
        );
    }

}
