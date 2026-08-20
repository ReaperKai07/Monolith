import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { LoadingOverlayService } from '../../../core/services/loading-overlay.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { NoticeDialogService } from '../../../core/services/notice-dialog.service';

@Component({
    selector: 'app-cryptek-lab',
    standalone: true,
    templateUrl: './cryptek-lab.component.html',
    imports: [
        AlertMessageComponent,
        PaginationComponent,
        SearchComponent,
        SkeletonLoaderComponent,
        ChartComponent,
    ],
})

export class CryptekLabComponent implements OnInit{

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _loadingOverlayService = inject(LoadingOverlayService);
    private readonly _snackbarService = inject(SnackbarService);
    private readonly _noticeService = inject(NoticeDialogService)

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

    // -----------------------------------------------------------------------------------------------------
    // @ Snackbar methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Displays a success snackbar
     */
    showSuccessSnackbar(): void {
        this._snackbarService.success(
            'The operation was completed successfully.',
            'Operation Successful'
        );
    }

    /**
     * Displays an error snackbar
     */
    showErrorSnackbar(): void {
        this._snackbarService.error(
            'Something went wrong while processing the request.',
            'Operation Failed'
        );
    }

    /**
     * Displays a warning snackbar
     */
    showWarningSnackbar(): void {
        this._snackbarService.warning(
            'Review the provided information before continuing.',
            'Review Required'
        );
    }

    /**
     * Displays an informational snackbar
     */
    showInfoSnackbar(): void {
        this._snackbarService.info(
            'This is an example informational notification.',
            'Information'
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Charts Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Bar Chart Data
     * Postion in array determine the data value and color
     */
    readonly chartData: ChartData<'bar'> = {
        labels: [ 
            'Frontend', 
            'Mobile', 
            'Backend', 
            'UI/UX', 
            'Data',
            'Tools', 
        ],
        datasets: [
            {
                label: 'Skills',
                data: [ 12, 6, 3, 2, 2, 5, ],
                backgroundColor: [
                    '#22c55e',
                    '#f97316',
                    '#3b82f6',
                    '#a855f7',
                    '#06b6d4',
                    '#78716c',
                ],
                borderRadius: 6,
            },
        ],
    };

    /**
     * Bar Chart Configuration
     */
    readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    /**
     * Doughnut Chart Data
     * Postion in array determine the data value and color
     */
    readonly doughnutChartData: ChartData<'doughnut'> = {
        labels: [ 
            'Completed', 
            'In Development', 
            'Planning', 
            'On Hold', 
        ],
        datasets: [
            {
                label: 'Projects',
                data: [ 
                    4, 
                    3, 
                    2, 
                    1, 
                ],
                backgroundColor: [
                    '#22c55e',
                    '#f97316',
                    '#3b82f6',
                    '#ef4444',
                ],
                borderWidth: 1,
            },
        ],
    };

    /**
     * Doughnut Chart Configuration
     */
    readonly doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Notice dialog methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the default work-in-progress notice
     */
    openNoticeDialog(): void {
        this._noticeService.open();
    }

}