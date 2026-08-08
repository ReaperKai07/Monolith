import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactGroup } from '../../../core/contacts/contacts.model';
import { ContactsService } from '../../../core/contacts/contacts.service';

@Component({
    selector: 'app-contacts',
    standalone: true,
    templateUrl: './contacts.component.html',
    imports: [

    ],
})

export class ContactsComponent implements OnInit {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _contactsService = inject(ContactsService);
    private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    contactGroups: ContactGroup[] = [];
    failedImages = new Set<string>();
    failedLogos = new Set<string>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to contact groups
         */
        this._contactsService.contactGroups$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(contactGroups => {
                this.contactGroups = contactGroups;
            });

        /*
         * Load contact groups from contacts.json
         */
        this._contactsService.initializeContacts()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: error => {
                    console.error('Failed to initialize contacts:', error);
                },
            });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Contact display methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Records a reference image that failed to load
     * @param image
     */
    onImageError(
        image: string
    ): void {
        this.failedImages.add(image);
    }

    /**
     * Records an organization logo that failed to load
     * @param logo
     */
    onLogoError(
        logo: string
    ): void {
        this.failedLogos.add(logo);
    }

}