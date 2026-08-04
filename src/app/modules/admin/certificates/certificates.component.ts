import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Certificate, CertificateType } from '../../../core/certificates/certificates.model';
import { CERTIFICATE_TYPES } from '../../../core/certificates/certificates.constants';
import { CertificatesService } from '../../../core/certificates/certificates.service';
import { Skill } from '../../../core/skills/skills.model';
import { SkillsService } from '../../../core/skills/skills.service';
import { DeleteDialogComponent, DeleteDialogData } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { DetailsCertificatesComponent, DetailsCertificatesDialogData } from './details-certificates/details-certificates.component';
import { SnackbarService } from '../../../core/services/snackbar.service';

type CertificateTypeFilter = 'All' | CertificateType;
type CertificateStatus = 'Valid' | 'Expired' | 'No Expiry';

@Component({
    selector: 'app-certificates',
    standalone: true,
    templateUrl: './certificates.component.html',
    imports: [
        DatePipe,
        NgClass,
        SlicePipe,
        MatTooltipModule,
        SearchComponent,
    ],
})
export class CertificatesComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _dialog = inject(MatDialog);
    private readonly _certificatesService = inject(CertificatesService);
    private readonly _skillsService = inject(SkillsService);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _snackbarService = inject(SnackbarService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly certificateTypes = CERTIFICATE_TYPES;

    selectedType: CertificateTypeFilter = 'All';
    searchTerm = '';

    certificatesList: Certificate[] = [];
    skillsList: Skill[] = [];

    failedLogos = new Set<string>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to the certificates service
         */
        this._certificatesService.certificates$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(certificates => {
                this.certificatesList = certificates;
            });

        /*
         * Load certificates from localStorage, or seed from certificates.json
         */
        this._certificatesService.initializeCertificates()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize certificates:', error);
                },
            });

        /*
         * Subscribe to skills for related-skill names
         */
        this._skillsService.skills$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(skills => {
                this.skillsList = skills;
            });

        /*
         * Load skills from localStorage, or seed from skills.json
         */
        this._skillsService
            .initializeSkills()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize skills:', error);
                },
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns certificates matching the search and type filters
     */
    get filteredCertificates(): Certificate[] {
        const search = this.searchTerm.trim().toLowerCase();
        return this.certificatesList.filter(certificate => {
            const matchesType = this.selectedType === 'All' || certificate.type === this.selectedType;
            if (!matchesType) {
                return false;
            }
            if (!search) {
                return true;
            }
            const searchableValues = [
                certificate.name,
                certificate.issuer,
                certificate.type,
                certificate.description,
                certificate.credentialId,
                ...this.getSkillNames(certificate.skillIds),
            ];
            return searchableValues.some(value =>
                value.toLowerCase().includes(search)
            );
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set and open create certificate dialog.
     */
    openCreateDialog(): void {
        this._openDetailsDialog({
            mode: 'create',
        });
    }

    /**
     * Set and open edit certificate dialog.
     * @param certificate
     */
    openEditDialog(
        certificate: Certificate
    ): void {
        this._openDetailsDialog({
            mode: 'edit',
            certificate,
        });
    }

    /**
     * Opens confirm delete dialog
     * @param certificate
     */
    openDeleteDialog(certificate: Certificate): void {
        const dialogRef = this._dialog.open<
            DeleteDialogComponent,
            DeleteDialogData,
            boolean
        >(
            DeleteDialogComponent,
            {
                width: '420px',
                maxWidth: 'calc(100vw - 32px)',
                autoFocus: false,
                data: {
                    itemName: certificate.name,
                    itemType: 'certificate',
                },
            }
        );
        dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.deleteCertificate(certificate.id);
            });
    }

    /**
     * Delete certificate by ID
     * @param certificateId
     */
    deleteCertificate(certificateId: number): void {
        this._certificatesService.deleteCertificate(certificateId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._snackbarService.success(
                        'The certificate was deleted successfully.',
                        'Certificate Deleted'
                    );
                },
                error: error => {
                    console.error('Failed to delete certificate:', error);
                    this._snackbarService.error(
                        'The certificate could not be deleted.',
                        'Delete Failed'
                    );
                },
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Opens the shared create and edit certificate dialog.
     * @param data
     */
    private _openDetailsDialog(
        data: DetailsCertificatesDialogData
    ): void {
        this._dialog.open<
            DetailsCertificatesComponent,
            DetailsCertificatesDialogData,
            Certificate
        >(
            DetailsCertificatesComponent,
            {
                width: '650px',
                maxWidth: 'calc(100vw - 32px)',
                maxHeight: 'calc(100vh - 32px)',
                autoFocus: false,
                data,
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Type filter methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates the selected certificate type
     * @param type
     */
    selectType(type: CertificateTypeFilter): void {
        this.selectedType = type;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Search methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Updates the current search term
     * @param searchTerm
     */
    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Certificate display methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns skill names linked to the provided IDs
     * @param skillIds
     */
    getSkillNames(skillIds: number[]): string[] {
        return this.skillsList
            .filter(skill => skillIds.includes(skill.id))
            .map(skill => skill.name);
    }

    /**
     * Returns the certificate expiry status
     * @param certificate
     */
    getCertificateStatus(
        certificate: Certificate
    ): CertificateStatus {
        if (!certificate.expiryDate) {
            return 'No Expiry';
        }
        const expiryDate = new Date(certificate.expiryDate);
        return expiryDate < new Date() ? 'Expired' : 'Valid';
    }

    /**
     * Tracks certificate logos that failed to load
     * @param logo
     */
    onLogoError(logo: string): void {
        this.failedLogos.add(logo);
    }

}