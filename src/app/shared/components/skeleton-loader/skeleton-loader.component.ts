import { Component, Input } from '@angular/core';

export type SkeletonShape = 'text' | 'rectangle' | 'circle';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    templateUrl: './skeleton-loader.component.html',
})

export class SkeletonLoaderComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    @Input() shape: SkeletonShape = 'rectangle';

    @Input() width = '100%';
    @Input() height = '16px';

    @Input() rounded = true;
    @Input() animated = true;

}