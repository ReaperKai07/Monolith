import { Injectable, computed, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoadingOverlayService {

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    // Signal keeps track of numbers of active requests
    private readonly _activeRequests = signal(0);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    // Signal indicates the loading overlay should be displayed or not
    readonly isLoading = computed(() => this._activeRequests() > 0);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    show(): void {
        this._activeRequests.update(count => count + 1);
    }

    hide(): void {
        this._activeRequests.update(count => Math.max(0, count - 1));
    }

    reset(): void {
        this._activeRequests.set(0);
    }
}
