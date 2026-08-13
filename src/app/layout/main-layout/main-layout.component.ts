import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from "@angular/router";
import { NoticeDialogService } from '../../core/services/notice-dialog.service';

@Component({
    selector: 'app-main-layout',
    imports: [
        SidebarComponent, 
        HeaderComponent, 
        RouterOutlet,
    ],
    templateUrl: './main-layout.component.html',
})

export class MainLayoutComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _noticeService = inject(NoticeDialogService);
    private readonly _aboutNoticeKey = 'monolith_about_notice_acknowledged';

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    sidebarOpen = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._showAboutNotice();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar(): void {
        this.sidebarOpen = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Displays the Monolith introduction once per login session
     */
    private _showAboutNotice(): void {
        const acknowledged = localStorage.getItem(this._aboutNoticeKey);
        if (acknowledged) {
            return;
        }
        this._noticeService.open({
            title: 'About Monolith',
            description: 'Before exploring the application, here are a few things to know.',
            items: [
                'Monolith is an enterprise-inspired dashboard built using Khairul’s portfolio data.',
                'Create, update and delete operations are simulated and stored locally in the browser to demonstrate dashboard workflows.',
                'Backend communication is currently simulated using local JSON data, Angular services and REST-style API patterns.',
                'Monolith is designed responsively for both desktop and mobile devices.',
                'Monolith is currently under active development. Last updated 14 August 2026.',
                'Portfolio information may not always reflect the latest professional or academic changes. Please refer to the latest resume and academic documents when required.',
            ],
            confirmLabel: 'I Understand',
        }).subscribe(confirmed => {
            if (!confirmed) {
                return;
            }
            localStorage.setItem(this._aboutNoticeKey, 'true');
        });
    }
}
