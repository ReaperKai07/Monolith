import { Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

export interface DeleteDialogData {
    itemName: string;
    itemType?: string;
}

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    imports: [
        MatDialogModule
    ],
})

export class DeleteDialogComponent {
    private readonly _dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

    readonly data =
        inject<DeleteDialogData>(MAT_DIALOG_DATA);

    cancel(): void {
        this._dialogRef.close(false);
    }

    confirmDelete(): void {
        this._dialogRef.close(true);
    }
}
