import { NoticeDialogData } from './notice-dialog.model';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NoticeDialogComponent } from '../../shared/components/notice-dialog/notice-dialog.component';

@Injectable({
    providedIn: 'root',
})

export class NoticeDialogService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens a reusable notice dialog
     */
    open(
        data: NoticeDialogData = {}
    ): Observable<boolean | undefined> {

        return this._dialog
            .open<NoticeDialogComponent, NoticeDialogData, boolean>(
                NoticeDialogComponent,
                {
                    width: 'calc(100vw - 32px)',
                    maxWidth: '32rem',
                    data,
                }
            )
            .afterClosed();
    }

}