import { Component, OnInit, Input } from '@angular/core'
import { IUserDietType } from '../../../shared/services/user-diet-type-resolver.service';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import * as UserPreferenceActions from '../store/actions/user-preferences.actions';

@Component({
    selector: 'app-user-diet-type',
    templateUrl: './user_diet_type.component.html' 
})
// This class displays the list of diet types and allows the user to choose a diet type.
export class UserDietTypeComponent implements OnInit {
    
    propertyName: String = 'dietType';

    constructor(private store : Store<AppState>) { }

    @Input() dietTypes : Array<IUserDietType>;

    // When the user selects a diet type, dispatch and action to fetch menu.
    onDietTypeSelect(dietType : String) {
        this.store.dispatch(new UserPreferenceActions.EditDietType(dietType));
    }

    ngOnInit(): void { }
}