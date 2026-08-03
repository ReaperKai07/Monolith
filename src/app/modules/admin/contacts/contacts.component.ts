import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Contact } from '../../../core/contacts/contacts.model';
import { ContactsService } from '../../../core/contacts/contacts.service';

interface ContactGroup {
    company: string;
    contacts: Contact[];
}

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

    contactsList: Contact[] = [];
    failedImages = new Set<string>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        /*
         * Subscribe to the contacts service
         */
        this._contactsService.contacts$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(contacts => {
                this.contactsList = contacts;
            });

        /*
         * Load contacts from contacts.json
         */
        this._contactsService.initializeContacts()
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                error: error => {
                    console.error('Failed to initialize contacts:', error);
                },
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Groups contacts by company
     */
    get contactGroups(): ContactGroup[] {
        const companyNames = [
            ...new Set(
                this.contactsList.map(
                    contact => contact.company
                )
            ),
        ];

        return companyNames.map(company => ({
            company,
            contacts: this.contactsList.filter(
                contact => contact.company === company
            ),
        }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Contact display methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Records a contact image that failed to load
     * @param image
     */
    onImageError(image: string): void {
        this.failedImages.add(image);
    }

}