import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../core/auth/auth.model';

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
})

export class SignInComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  // Create SignInForm
  signInForm = this.formBuilder.nonNullable.group({
    email: [ '', [ Validators.required, Validators.email ]],
    password: [ '', [ Validators.required, Validators.minLength(8) ]],
  })

  /**
   * Sign In
   * @returns 
   */
  signIn(): void {

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const request : LoginRequest = this.signInForm.getRawValue();

    this.authService.signIn(request).subscribe({
      next : response => {
        console.log(response);
      },
      error : error => {
        console.error(error);
      }
    });

  }

}
