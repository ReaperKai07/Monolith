import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoticeDialogData } from './../../../core/services/notice-dialog.model';

@Component({
    selector: 'app-notice-dialog',
    standalone: true,
    templateUrl: './notice-dialog.component.html',
    imports: [
        MatDialogModule,
    ],
})

export class NoticeDialogComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialogRef = inject(MatDialogRef<NoticeDialogComponent>);
    readonly data = inject<NoticeDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Confirms the notice
     */
    confirm(): void {
        this._dialogRef.close(true);
    }

}