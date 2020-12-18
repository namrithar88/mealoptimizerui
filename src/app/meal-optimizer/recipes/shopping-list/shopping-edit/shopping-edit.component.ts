import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ShoppingItem } from '../../../../shared/model/shopping-item-model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../../../store/reducers/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) slForm: NgForm;
  
  subscription: Subscription;
  editMode = false;
  editedItem: ShoppingItem = null;

  defaultLabel : String = 'Added by user';

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe(stateData => {
        if (stateData.editedshoppingItemIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedshoppingItem;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
            measure: this.editedItem.measure
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {    
    const value = form.value;
    //console.log('pristine : ' + form.controls['name'].pristine + ' dirty : '+ form.controls['name'].dirty + ' touched : ' + form.controls['name'].touched);
    let updatedLabels = null;    
    let newIngredient = null;    
    if (this.editMode) {
      //Calculate updatedLabels. Add the label 'Added by User' if it is not already available 
      updatedLabels = this.editedItem.labels.slice();
      if(!updatedLabels.includes(this.defaultLabel)) updatedLabels.push(this.defaultLabel);
      //Create the ingredient to be updated
      newIngredient = new ShoppingItem(value.name, value.amount, value.measure, updatedLabels); 
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient({ shoppingItem : newIngredient, itemNameUpdated : form.controls['name'].touched })
      );
    } else {
      //Create the ingredient to be added
      newIngredient = new ShoppingItem(value.name, value.amount, value.measure, [this.defaultLabel]);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }    
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}