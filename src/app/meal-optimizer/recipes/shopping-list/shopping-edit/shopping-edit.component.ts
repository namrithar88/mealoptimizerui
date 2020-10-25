import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserInputService } from 'src/app/shared/services/user-input.service';
import { IngredientValidatorService } from '../../../../shared/services/ingredientValidator.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  //Mode can be create or update (Add or Update). Used to track whether 'Add' or 'Update' must be displayed in the UI.
  mode : String = 'Add';

  //We use reactive forms. shoppingEdit is the object in ts that maps to the HTML form.
  shoppingEdit : FormGroup;

  defaultLabel : String = 'Added by user';

  onEditIngredient : Subscription;

  indexOfIngredient : number;

  //This can be changed to new Subject<>() in the user-input.service and we can subscribe to the event here.
  //We can even use existing observables onAddIngredientsToShoppingList and onEditIngredientsInShoppingList
  //We leave it as such for reference
  @Output() addIngredient = new EventEmitter<{ ingredientName:String, ingredientAmount:number, ingredientLabels:String[] }>();

  @Output() deleteIngredient = new EventEmitter<{ ingredientName:String }>();

  @Output() updateIngredient = new EventEmitter< { indexOfIngredient : number, ingredientName : String, ingredientAmount : number, ingredientNameUpdated: boolean} >();

  constructor(private ingredientValidatorService : IngredientValidatorService, private userInputService : UserInputService) { }

  ngOnInit(): void {
    this.shoppingEdit = new FormGroup({
      'ingredientName' : new FormControl('Enter ingredient name here', Validators.required),
      'ingredientAmount': new FormControl(null, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")])
    });

    /* 
    When the field ingredientName is updated (touched), set ingredientAmount=1 
    by listening to the angular event 'valueChanges'. This event is emitted only
    when reactive forms is used.
    */
    this.shoppingEdit.get('ingredientName').valueChanges.subscribe((value) => {
      this.shoppingEdit.get('ingredientAmount').setValue(1);
    });

    //This observable is triggered when the user wants to edit an existing ingredient.
    this.onEditIngredient = this.userInputService.onEditIngredientsInShoppingList.subscribe((ingredientInfo) => {
      this.mode = 'Update';
      this.indexOfIngredient = ingredientInfo.indexOfShoppingListItem;
      this.shoppingEdit.setValue(
        { 'ingredientName' : ingredientInfo.shoppingItem.name,
          'ingredientAmount' : ingredientInfo.shoppingItem.amount
        });
    });
  }

  onAddOrUpdateIngredient() : void {
    var ingredientName : String = this.shoppingEdit.get('ingredientName').value;
    //Validate ingredient entered - the ingredient must either belong to a list of valid ingredients, or the user must confirm that he wants to add the ingredient to the list.
    if(this.ingredientValidatorService.isValidIngredient(ingredientName) || 
      confirm(ingredientName + " does not look like a valid ingredient. Are you sure you want to add it to your shopping list?")) {
        //To add ingredient, modify the label and send the ingredientInfo to shoppinglist to eb added.
        if(this.mode.toLowerCase() === 'add') {
          var label = new Array<String>();
          label.push(this.defaultLabel);
          this.addIngredient.emit({ ingredientName : ingredientName, ingredientAmount:this.shoppingEdit.get('ingredientAmount').value, ingredientLabels: label }); 
        }

        //To update ingredient, send the updated ingredient info to shoppinglist. Label need not be updated. 
        if(this.mode.toLowerCase() === 'update') {
          this.updateIngredient.emit({ indexOfIngredient : this.indexOfIngredient, ingredientName : ingredientName, ingredientAmount:this.shoppingEdit.get('ingredientAmount').value, ingredientNameUpdated:this.shoppingEdit.get('ingredientName').touched }); 
          this.mode = 'Add';
          this.onClearIngredient();
        }
      }
  }

  onDeleteIngredient() : void {
    this.deleteIngredient.emit({ ingredientName:this.shoppingEdit.get('ingredientName').value });
    this.mode = 'Add';
    this.onClearIngredient();
  }

  onClearIngredient() : void {
    this.shoppingEdit.reset();
    this.mode = 'Add';
  }

  ngOnDestroy() : void {
    this.onEditIngredient.unsubscribe();
  }
}