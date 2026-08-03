import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { Certificate, CreateCertificateRequest, UpdateCertificateRequest } from './certificates.model';

@Injectable({
    providedIn: 'root'
})

export class CertificatesService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _certificatesUrl = '/assets/data/certificates.json';
    private readonly _storageKey = 'monolith_certificates';
    private readonly _certificates = new BehaviorSubject<Certificate[]>([]);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns the current certificates data as an observable
     */
    get certificates$(): Observable<Certificate[]> {
        return this._certificates.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load certificates from localStorage, or seed from certificates.json
     */
    initializeCertificates(): Observable<Certificate[]> {
        const storedCertificates = localStorage.getItem(this._storageKey);
        if (storedCertificates) {
            try {
                const certificates = JSON.parse(storedCertificates) as Certificate[];
                this._certificates.next(certificates);
                return of(certificates);
            } catch {
                localStorage.removeItem(this._storageKey);
            }
        }
        return this._loadSeedCertificates();
    }

    /**
     * Returns all certificates
     */
    getCertificates(): Observable<Certificate[]> {
        if (this._certificates.value.length > 0) {
            return of(this._certificates.value);
        }
        return this.initializeCertificates();
    }

    /**
     * Returns a certificate by ID
     * @param certificateId
     */
    getCertificateById(
        certificateId: number
    ): Observable<Certificate> {
        return this.getCertificates()
            .pipe(
                switchMap(certificates => {
                    const certificate = certificates.find(item => item.id === certificateId);
                    if (!certificate) {
                        return throwError(() =>
                            new Error(`Certificate with ID ${certificateId} was not found.`));
                    }
                    return of(certificate);
                })
            );
    }

    /**
     * Creates a new certificate
     * @param request
     */
    createCertificate(
        request: CreateCertificateRequest
    ): Observable<Certificate> {
        return this.getCertificates()
            .pipe(
                map(certificates => {
                    const certificate: Certificate = {
                        ...request,
                        id: this._generateNextId(certificates),
                    };
                    const updatedCertificates = [
                        ...certificates,
                        certificate,
                    ];
                    this._saveCertificates(updatedCertificates);
                    return certificate;
                })
            );
    }

    /**
     * Updates a certificate by ID
     * @param certificateId
     * @param request
     */
    updateCertificate(
        certificateId: number,
        request: UpdateCertificateRequest
    ): Observable<Certificate> {
        return this.getCertificates()
            .pipe(
                switchMap(certificates => {
                    const certificateIndex = certificates.findIndex(certificate =>certificate.id === certificateId);
                    if (certificateIndex === -1) {
                        return throwError(() =>
                            new Error(`Certificate with ID ${certificateId} was not found.`)
                        );
                    }
                    const updatedCertificate: Certificate = {
                        ...certificates[certificateIndex],
                        ...request,
                        id: certificateId,
                    };
                    const updatedCertificates = [
                        ...certificates,
                    ];
                    updatedCertificates[certificateIndex] = updatedCertificate;
                    this._saveCertificates(updatedCertificates);
                    return of(updatedCertificate);
                })
            );
    }

    /**
     * Deletes a certificate by ID
     * @param certificateId
     */
    deleteCertificate(
        certificateId: number
    ): Observable<boolean> {
        return this.getCertificates()
            .pipe(
                switchMap(certificates => {
                    const certificateExists =
                        certificates.some(certificate =>certificate.id === certificateId);
                    if (!certificateExists) {
                        return throwError(() =>
                            new Error(`Certificate with ID ${certificateId} was not found.`)
                        );
                    }
                    const updatedCertificates = certificates.filter(certificate => certificate.id !== certificateId);
                    this._saveCertificates(updatedCertificates);
                    return of(true);
                })
            );
    }

    /**
     * Clears saved changes and reloads certificates.json
     */
    resetCertificates(): Observable<Certificate[]> {
        localStorage.removeItem(this._storageKey);
        return this._loadSeedCertificates();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads the initial certificates data from certificates.json
     */
    private _loadSeedCertificates():
        Observable<Certificate[]> {
        return this._httpClient
            .get<Certificate[]>(this._certificatesUrl)
            .pipe(
                tap(certificates => {
                    this._saveCertificates(certificates);
                })
            );
    }

    /**
     * Saves certificates and updates the observable
     * @param certificates
     */
    private _saveCertificates(
        certificates: Certificate[]
    ): void {
        localStorage.setItem(
            this._storageKey,
            JSON.stringify(certificates)
        );
        this._certificates.next(certificates);
    }

    /**
     * Generates the next available certificate ID
     * @param certificates
     */
    private _generateNextId(
        certificates: Certificate[]
    ): number {
        if (certificates.length === 0) {
            return 1;
        }
        return Math.max(
            ...certificates.map(
                certificate => certificate.id
            )
        ) + 1;
    }

}
