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
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';

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
        CommonModule,
        AlertComponent
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
        // Hide alert
        this.showAlert = false;
        // If form invalid
        if (this.signInForm.invalid) {
            this.signInForm.markAllAsTouched();
            this.alert = {
                type: 'error',
                message: 'Please enter a valid email and password.'
            };
            this.showAlert = true;
            return;
        }
        // Disable form
        this.signInForm.disable();
        // Sign in 
        this._authService.signIn(this.signInForm.getRawValue())
            .subscribe({
                next : response => {
                    // Get user details
                    this._authService.getUserDetails(response.userId).subscribe({
                        next: user => {
                            // Log response
                            console.log(user);
                            // Set the redirect url
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                            // Navigate to the redirect url
                            this._router.navigateByUrl(redirectURL);
                        }
                    });
                },
                error : error => {
                    // Log error
                    console.error(error);
                    // Re-enable the form
                    this.signInForm.enable();
                    // Show alert
                    this.showAlert = true;
                    // Set alert
                    this.alert = {type: 'error', message: error.message || 'Invalid email or password.'};
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Shared Components
    // -----------------------------------------------------------------------------------------------------

    /**
     * Alert
     */
    showAlert = false;
    alert: {
        type: AlertType;
        message: string;
    } = {
        type: 'error',
        message: ''
    };
}
