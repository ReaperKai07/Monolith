import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
    selector: 'app-cryptek-lab',
    standalone: true,
    templateUrl: './cryptek-lab.component.html',
    imports: [
        AlertMessageComponent,
        PaginationComponent,
        SearchComponent,
    ],
})

export class CryptekLabComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    searchTerm = '';
    currentPage = 1;
    readonly pageSize = 10;
    readonly totalItems = 42;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the reusable delete dialog.
     */
    openDeleteDialog(): void {
        const dialogRef = this._dialog.open<
            DeleteDialogComponent,
            DeleteDialogData,
            boolean
        >(
            DeleteDialogComponent,
            {
                width: '420px',
                maxWidth: 'calc(100vw - 32px)',
                autoFocus: false,
                data: {
                    itemName: 'Example Item',
                    itemType: 'component',
                },
            }
        );
        dialogRef
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(confirmed => {
                console.log('Delete confirmed:', confirmed);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Pagination methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handles page changes from PaginationComponent.
     * @param page
     */
    onPageChange(page: number): void {
        this.currentPage = page;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Search methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handles search values from SearchComponent.
     * @param searchTerm
     */
    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
    }

}