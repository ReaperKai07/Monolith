import { Component, inject } from '@angular/core';
import { LoadingOverlayService } from '../../../core/services/loading-overlay.service';

@Component({
    selector: 'app-loading-overlay',
    templateUrl: './loading-overlay.component.html',
    imports: [

    ],
})

export class LoadingOverlayComponent {

    /**
     * Constructor
     */
    constructor(){}

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    readonly _loadingOverlayService = inject(LoadingOverlayService);

}
