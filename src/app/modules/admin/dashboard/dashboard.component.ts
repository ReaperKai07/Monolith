import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

type UpdateType = 'Added' | 'Updated' | 'Deleted';
interface RecentUpdate {
    id: number;
    type: UpdateType;
    comment: string;
    createdAt: Date;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        MatIconModule,
        MatListModule,
        DatePipe,
        NgClass
    ],
})

export class DashboardComponent {

    // Mock data test
    recentUpdates: RecentUpdate[] = [
        {
            id: 1,
            type: 'Added',
            comment: 'Added dashboard quick analytics cards',
            createdAt: new Date('2026-07-29T10:35:12')
        },
        {
            id: 2,
            type: 'Updated',
            comment: 'Improved responsive layout for the dashboard',
            createdAt: new Date('2026-07-29T09:18:45')
        },
        {
            id: 3,
            type: 'Deleted',
            comment: 'Removed unused profile service implementation',
            createdAt: new Date('2026-07-28T16:42:08')
        }
    ];

    // Set styling for the update type column
    getUpdateTypeClasses(type: UpdateType): string {
        switch (type) {
            case 'Added':
                return 'bg-green-100 text-green-700';
            case 'Updated':
                return 'bg-blue-100 text-blue-700';
            case 'Deleted':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-stone-100 text-stone-700';
        }

    }

}
