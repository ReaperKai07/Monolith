import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-main-layout',
    imports: [
        SidebarComponent, 
        HeaderComponent, 
        RouterOutlet,
    ],
    templateUrl: './main-layout.component.html',
})

export class MainLayoutComponent {

    sidebarOpen = false;

    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar(): void {
        this.sidebarOpen = false;
    }
}
