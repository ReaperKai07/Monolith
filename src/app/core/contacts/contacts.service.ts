import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Contact } from './contacts.model';

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

    private readonly _contactsUrl = '/assets/data/contacts.json';
    private readonly _contacts = new BehaviorSubject<Contact[]>([]);
    private _initialized = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns the current contacts data as an observable
     */
    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Loads contacts from contacts.json
     */
    initializeContacts(): Observable<Contact[]> {
        if (this._initialized) {
            return of(this._contacts.value);
        }
        return this._httpClient.get<Contact[]>(this._contactsUrl)
            .pipe(
                tap(contacts => {
                    this._contacts.next(contacts);
                    this._initialized = true;
                })
            );
    }

    /**
     * Returns all contacts
     */
    getContacts(): Observable<Contact[]> {
        if (this._initialized) {
            return of(this._contacts.value);
        }

        return this.initializeContacts();
    }

}