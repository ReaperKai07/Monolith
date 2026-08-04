import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CERTIFICATE_TYPES } from '../../../../core/certificates/certificates.constants';
import {
    Certificate,
    CertificateType,
    CreateCertificateRequest,
    UpdateCertificateRequest,
} from '../../../../core/certificates/certificates.model';
import { CertificatesService } from '../../../../core/certificates/certificates.service';
import { Skill } from '../../../../core/skills/skills.model';
import { SkillsService } from '../../../../core/skills/skills.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

export type DetailsCertificatesMode = 'create' | 'edit';

export interface DetailsCertificatesDialogData {
    mode: DetailsCertificatesMode;
    certificate?: Certificate;
}

/**
 * Validates the certificate issue and expiry dates.
 */
const certificateDateValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const issueDate = control.get('issueDate')?.value as Date | null;
    const expiryDate = control.get('expiryDate')?.value as Date | null;
    if (issueDate && expiryDate && expiryDate < issueDate) {
        return {
            invalidDateRange: true,
        };
    }
    return null;
};

@Component({
    selector: 'app-details-certificates',
    standalone: true,
    templateUrl: './details-certificates.component.html',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    providers: [
        provideNativeDateAdapter(),
    ],
})

export class DetailsCertificatesComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _formBuilder = inject(FormBuilder);
    private readonly _certificatesService = inject(CertificatesService);
    private readonly _skillsService = inject(SkillsService);
    private readonly _dialogRef = inject(MatDialogRef<DetailsCertificatesComponent>);
    private readonly _snackbarService = inject(SnackbarService)

    readonly data = inject<DetailsCertificatesDialogData>(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly certificateTypes = CERTIFICATE_TYPES;

    skillsList: Skill[] = [];

    isSubmitting = false;
    formSubmitted = false;

    readonly certificateForm =
        this._formBuilder.group({
                name: [ '', [ Validators.required, Validators.maxLength(150), ], ],
                issuer: [ '', [ Validators.required, Validators.maxLength(100), ], ],
                type: [ null as CertificateType | null, Validators.required, ],
                description: [ '', [ Validators.required, Validators.maxLength(500), ], ],
                issueDate: [ null as Date | null, Validators.required, ],
                expiryDate: [ null as Date | null, ],
                credentialId: [ '', [ Validators.maxLength(150), ], ],
                credentialUrl: [ '', [ Validators.pattern( /^https?:\/\/.+/i ), ], ], 
                certificateFileUrl: [ '', [ Validators.maxLength(300), ], ],
                logo: [ '', [ Validators.maxLength(100), ], ],
                skillIds: [ [] as number[], ],
            },
            { 
                validators: [ certificateDateValidator ],
            }
        );

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.loadSkills();

        if (this.data.mode === 'edit' && this.data.certificate) {
            this.populateForm(
                this.data.certificate
            );
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Closes the dialog without saving.
     */
    cancel(): void {
        this._dialogRef.close();
    }

    /**
     * Creates or updates the certificate.
     */
    submit(): void {
        this.formSubmitted = true;
        if (this.certificateForm.invalid) {
            this.certificateForm.markAllAsTouched();
            return;
        }
        this.isSubmitting = true;
        this.certificateForm.disable();
        const formValue = this.certificateForm.getRawValue();
        const request: CreateCertificateRequest = {
            name: formValue.name!.trim(),
            issuer: formValue.issuer!.trim(),
            type: formValue.type!,
            description: formValue.description!.trim(),
            issueDate: formValue.issueDate,
            expiryDate: formValue.expiryDate,
            credentialId: formValue.credentialId?.trim() ?? '',
            credentialUrl: formValue.credentialUrl?.trim() ?? '',
            certificateFileUrl: formValue.certificateFileUrl?.trim() ?? '',
            logo: formValue.logo?.trim() ?? '',
            skillIds: formValue.skillIds ?? [],
        };
        if (this.data.mode === 'edit' && this.data.certificate) {
            this.updateCertificate(
                this.data.certificate.id,
                request
            );
            return;
        }
        this.createCertificate(request);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads skills for the related-skills selector.
     */
    private loadSkills(): void {
        this._skillsService.getSkills()
            .subscribe({
                next: skills => {
                    this.skillsList = skills;
                },
                error: error => {
                    console.error('Failed to load skills:', error);
                },
            });
    }

    /**
     * Populates the form when editing.
     */
    private populateForm(
        certificate: Certificate
    ): void {
        this.certificateForm.patchValue({
            name: certificate.name,
            issuer: certificate.issuer,
            type: certificate.type,
            description: certificate.description,
            issueDate: certificate.issueDate ? new Date(certificate.issueDate) : null,
            expiryDate: certificate.expiryDate ? new Date(certificate.expiryDate) : null,
            credentialId: certificate.credentialId,
            credentialUrl: certificate.credentialUrl,
            certificateFileUrl: certificate.certificateFileUrl,
            logo: certificate.logo,
            skillIds: [ ...certificate.skillIds, ],
        });
    }

    /**
     * Creates a new certificate.
     */
    private createCertificate(
        request: CreateCertificateRequest
    ): void {
        this._certificatesService.createCertificate(request)
            .subscribe({
                next: certificate => {
                    this._snackbarService.success(
                        `"${certificate.name}" was created successfully.`, 
                        'New Certificate Created'
                    );
                    this._dialogRef.close(certificate);
                },
                error: error => {
                    console.error('Failed to create certificate:', error);
                    this._snackbarService.error(
                        'The certificate could not be created. Please try again.', 
                        'Create Failed'
                    );
                    this.restoreForm();
                },
            });
    }

    /**
     * Updates an existing certificate.
     */
    private updateCertificate(
        certificateId: number,
        request: UpdateCertificateRequest
    ): void {
        this._certificatesService.updateCertificate(
                certificateId,
                request
            )
            .subscribe({
                next: certificate => {
                    this._snackbarService.success(
                        `"${certificate.name}" was updated successfully.`, 
                        'Certificate Updated'
                    );
                    this._dialogRef.close(certificate);
                },
                error: error => {
                    console.error('Failed to update certificate:', error);
                    this._snackbarService.error(
                        'The certificate could not be updated. Please try again.', 
                        'Update Failed'
                    );
                    this.restoreForm();
                },
            });
    }

    /**
     * Restores the form after an error.
     */
    private restoreForm(): void {
        this.isSubmitting = false;
        this.certificateForm.enable();
    }

}