import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../core/user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    imports: [
        AsyncPipe
    ],
})

export class HeaderComponent {

    @Output()
    menuClicked = new EventEmitter<void>();

    onMenuClick(): void {
        this.menuClicked.emit();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly currentUser$ = this._userService.currentUser$;

    // -----------------------------------------------------------------------------------------------------
    // @ Public Methods
    // -----------------------------------------------------------------------------------------------------

    openProfile(){
        this._router.navigate(['/profile'])
    }

}
