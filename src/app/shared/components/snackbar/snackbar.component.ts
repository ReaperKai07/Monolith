import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarData {
    type: SnackbarType;
    title: string;
    message: string;
}

@Component({
    selector: 'app-snackbar',
    standalone: true,
    templateUrl: './snackbar.component.html',
    imports: [
        NgClass,
    ],
})

export class SnackbarComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _snackbarRef = inject(MatSnackBarRef<SnackbarComponent>);

    readonly data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismisses the snackbar
     */
    dismiss(): void {
        this._snackbarRef.dismiss();
    }

}