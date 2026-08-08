import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    of,
    tap,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { ContactGroup } from './contacts.model';

@Injectable({
    providedIn: 'root',
})

export class ContactsService {

    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Private properties
    // -----------------------------------------------------------------------------------------------------

    private readonly _contactsUrl = `${environment.apiUrl}/contacts.json`;
    private readonly _contactGroups = new BehaviorSubject<ContactGroup[]>([]);
    private _initialized = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns contact groups as an observable
     */
    readonly contactGroups$ = this._contactGroups.asObservable();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads contact groups from contacts.json
     */
    initializeContacts(): Observable<ContactGroup[]> {
        if (this._initialized) {
            return of(this._contactGroups.value);
        }
        return this._httpClient.get<ContactGroup[]>(this._contactsUrl)
            .pipe(
                tap(contactGroups => {
                    this._contactGroups.next(contactGroups);
                    this._initialized = true;
                })
            );
    }

    /**
     * Returns all contact groups
     */
    getContactGroups(): Observable<ContactGroup[]> {
        if (this._initialized) {
            return of(this._contactGroups.value);
        }
        return this.initializeContacts();
    }

}