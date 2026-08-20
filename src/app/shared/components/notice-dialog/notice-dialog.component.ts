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
    // @ Default Notice Dialog Settings
    // -----------------------------------------------------------------------------------------------------

    readonly defaultTitle = 'Work in Progress';
    readonly defaultDescription = 'This feature is currently under development.';
    readonly defaultItems: string[] = [
        'Development is currently focused on other sections and core functionality.',
        'Please contact Khairul if you would like more information about the planned implementation.',
    ];
    readonly defaultConfirmLabel = 'I Understand';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Confirms the notice
     */
    confirm(): void {
        this._dialogRef.close(true);
    }

    /**
     * Determine item
     */
    get items(): string[] {
        return this.data.items ?? this.defaultItems;
    }

}