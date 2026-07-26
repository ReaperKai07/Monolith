import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessageComponent, AlertType } from '../../../shared/components/alert-message/alert-message.component';

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
        AlertMessageComponent,
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})

export class SignInComponent implements OnInit {

    signInForm!: UntypedFormGroup;
    hidePassword = true;
    isLoading = false;

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
     * Authenticates user and get user details
     * redirecting them to the requested page or dashboard
     * @returns     
     */
    signIn(): void {
        this.isLoading = true;
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
        this.signInForm.disable();
        // Sign in 
        this._authService.signIn(this.signInForm.getRawValue())
            .subscribe({
                next : response => {
                    // Get user details
                    this._authService.getUserDetails(response.userId).subscribe({
                        next: user => {
                            this.isLoading = false;
                            console.log('Login success :',user);
                            // Set redirect to originally requested page, or fall back to dashboard
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                            this._router.navigateByUrl(redirectURL);
                        }
                    });
                },
                error : error => {
                    console.error('Login error :', error);
                    this.isLoading = false;
                    this.signInForm.enable();
                    this.showAlert = true;
                    // Set alert icon and message
                    this.alert = {
                        type: 'error', 
                        message: error.message || 'Invalid email or password.'
                    };
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Shared components
    // -----------------------------------------------------------------------------------------------------

    /**
     * Alert Message
     */
    showAlert = false;
    alert: {
        // set icon
        type: AlertType;
        message: string;
    } = {
        // set message
        type: 'error',
        message: ''
    };
}
