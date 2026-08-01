import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed,} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    imports: [
        ReactiveFormsModule,
    ],
})

export class SearchComponent implements OnInit {

    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Placeholder displayed inside the search input.
     */
    @Input()
    placeholder = 'Search...';

    /**
     * Delay before emitting the search value.
     */
    @Input()
    debounceTimeMs = 200;

    /**
     * Emits the normalized search value.
     */
    @Output()
    searchChange = new EventEmitter<string>();

    readonly searchControl = new FormControl('', { nonNullable: true });

    ngOnInit(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounceTimeMs),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(value => {
                this.searchChange.emit(
                    // value.trim().toLowerCase() // trimming whitespace and converting to lowercase.
                    value.trim() // trimming whitespace only.
                );
            });
    }

    clearSearch(): void {
        this.searchControl.setValue('');
    }

}