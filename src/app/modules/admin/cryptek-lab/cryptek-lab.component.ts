import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { LoadingOverlayService } from '../../../core/services/loading-overlay.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
    selector: 'app-cryptek-lab',
    standalone: true,
    templateUrl: './cryptek-lab.component.html',
    imports: [
        AlertMessageComponent,
        PaginationComponent,
        SearchComponent,
        SkeletonLoaderComponent,
    ],
})

export class CryptekLabComponent implements OnInit{

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _loadingOverlayService = inject(LoadingOverlayService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    isSkeletonLoading = true;
    searchTerm = '';
    currentPage = 1;
    readonly pageSize = 10;
    readonly totalItems = 42;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.reloadSkeletonDemo();
    }

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

    // -----------------------------------------------------------------------------------------------------
    // @ Loading Overlay methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Shows the loading overlay for demonstration.
     */
    showLoadingOverlay(): void {
        this._loadingOverlayService.show();
        setTimeout(() => {
            this._loadingOverlayService.hide();
        }, 2000);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Skeleton Loader methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Shows skeleton loadings before reveal demo content
     */
    reloadSkeletonDemo(): void {
        this.isSkeletonLoading = true;
        setTimeout(() => {
            this.isSkeletonLoading = false;
        }, 1000);
    }

}