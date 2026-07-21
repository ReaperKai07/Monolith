import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../core/auth/auth.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        CommonModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})

export class SignInComponent implements OnInit {

    signInForm!: UntypedFormGroup;

    hidePassword = true;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder, 
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ){}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        // Create SignInForm
        this.signInForm = this._formBuilder.group({
            email: [ 'khairulizzatroslan@gmail.com', [ Validators.required, Validators.email ]],
            password: [ '870327Tun@', [ Validators.required, Validators.minLength(8) ]],
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign In & Get User by ID
     * @returns     
     */
    signIn(): void {

        // Check form validation
        if (this.signInForm.invalid) {
            this.signInForm.markAllAsTouched();
            return;
        }

        // Assign body
        const body : LoginRequest = this.signInForm.getRawValue();

        this._authService.signIn(body).subscribe({
            next : response => {
                // Get user details
                this._authService.getUserDetails(response.userId).subscribe({
                    next: user => {
                        console.log(user);
                        // Set the redirect url
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                        // Navigate to the redirect url
                        this._router.navigateByUrl(redirectURL);
                    }
                });
            },
            error : error => {
                console.error(error);
            }
        });

    }

}
