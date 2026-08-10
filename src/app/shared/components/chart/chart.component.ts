import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {
    Chart,
    ChartConfiguration,
    ChartData,
    ChartType,
    registerables,
} from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-chart',
    standalone: true,
    templateUrl: './chart.component.html',
    imports: [

    ],
})

export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {

    // -----------------------------------------------------------------------------------------------------
    // @ Inputs
    // -----------------------------------------------------------------------------------------------------

    @Input() type: ChartType = 'bar';
    @Input() data!: ChartData;
    @Input() options?: ChartConfiguration['options'];

    // -----------------------------------------------------------------------------------------------------
    // @ View children
    // -----------------------------------------------------------------------------------------------------

    @ViewChild('chartCanvas')
    private readonly _chartCanvas!: ElementRef<HTMLCanvasElement>;

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private _chart: Chart | null = null;
    private _viewInitialized = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * After View Init
     */
    ngAfterViewInit(): void {
        this._viewInitialized = true;
        this._renderChart();
    }

    /**
     * On Chnages
     * @param changes 
     */
    ngOnChanges(
        changes: SimpleChanges
    ): void {
        if (
            this._viewInitialized &&
            (
                changes['data'] ||
                changes['type'] ||
                changes['options']
            )
        ) {
            this._renderChart();
        }
    }

    /**
     * On Destroy
     */
    ngOnDestroy(): void {
        this._destroyChart();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Creates or recreates the Chart.js instance
     */
    private _renderChart(): void {
        if (
            !this._chartCanvas ||
            !this.data
        ) {
            return;
        }
        this._destroyChart();
        this._chart = new Chart(
            this._chartCanvas.nativeElement,
            {
                type: this.type,
                data: this.data,
                options: this.options,
            }
        );
    }

    /**
     * Destroys the current chart instance
     */
    private _destroyChart(): void {
        if (!this._chart) {
            return;
        }
        this._chart.destroy();
        this._chart = null;
    }

}