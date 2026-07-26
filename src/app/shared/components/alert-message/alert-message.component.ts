import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
    selector: 'alert-message',
    standalone: true,
    imports: [
        NgClass,
        MatIconModule,
    ],
    templateUrl: './alert-message.component.html',
    styleUrl: './alert-message.component.scss'
})

export class AlertMessageComponent {

    // -----------------------------------------------------------------------------------------------------
    // @ Inputs
    // -----------------------------------------------------------------------------------------------------

    /**
     * Determine if alert displayed
     */
    @Input() show = true;

    /**
     * Determine if alert icon displayed
     */
    @Input() showIcon = true;
    
    /**
     * Alert icon
     */
    @Input() type: AlertType = 'info';

    /**
     * Alert message
     */
    @Input() message = '';



    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set alert icon - Material icon
     */
    get icon(): string {
        switch (this.type) {
            case 'success':
                return 'check_circle';

            case 'error':
                return 'error';

            case 'warning':
                return 'warning';

            default:
                return 'info';
        }
    }

}
