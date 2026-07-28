import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        MatIconModule,
        MatListModule
    ],
})

export class DashboardComponent {

}
