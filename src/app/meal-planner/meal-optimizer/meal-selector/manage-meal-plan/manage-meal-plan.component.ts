import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderService } from 'src/app/shared/services/order.service';
import { User } from 'src/app/shared/model/user.model';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { UserPreferences } from '../../store/reducers/user-preferences.reducer';
import { AuthenticatedUser } from 'src/app/user-mgmt/store/reducers/user-mgmt.reducer';
import * as OrderActions from '../../store/actions/order.actions';
import { OptimizedMealPlans } from '../../store/reducers/order.reducer';
import { OrderResponse } from 'src/app/shared/model/order-response.model';
import { HttpRequestStatus } from 'src/app/shared/http-request-status.enum';

@Component({
  selector: 'app-manage-meal-plan',
  templateUrl: './manage-meal-plan.component.html',
  styleUrls: ['./manage-meal-plan.component.css']
})
/* This component performs 3 actions
 * Get mode from the url : This decide whether the backend call must be a CREATE (POST) or an UPDATE (PUT)
 * Get values of user prefs and authenticated user from the store and create the meal plan request
 * Call backend by dispatching the action CREATE_ORDER_START
 */
export class ManageMealPlanComponent implements OnInit, OnDestroy {

  //Enable or disable the 'Get Meal Plan' button based on whether the user inputs are valid or not
  disableGetMealPlan : boolean = false;

  //This value is truthy if a valid meal plan is generated atleast once. 
  //We need the ID of the generated meal plan for further updates.
  savedMealPlans : OrderResponse;
  
  //Read the user inputs from store to generate a meal plan request
  userPrefs : UserPreferences;

  //Read the authenticatedUser info from store to include user ID in the meal plan request
  authenticatedUser : User;

  //Mode toggles between get and update to either generate meal plan for the first time 
  //or to update an existing meal plan.
  mode : String;

  constructor(private store : Store<AppState>, 
              private router : Router, 
              private route:ActivatedRoute, 
              private orderService : OrderService) { }

  ngOnInit(): void {
        // Get value of mode (create or edit)
        this.route.queryParams.subscribe((queryParams : String) => {
          this.mode = queryParams['optimizermode'];
        });

        this.store.select('userPreferences').subscribe((userPrefs : UserPreferences) => {
          this.userPrefs = userPrefs;
        });

        this.store.select('authenticatedUser').subscribe((authenticatedUser : AuthenticatedUser) => {
          this.authenticatedUser = authenticatedUser.user;
        });

        //Switch to 'update' mode if there is no error and optimization result state is DISTINCT OR OPTIMAL OR FEASIBLE
        this.store.select('optimizedPlans').subscribe((optimizedMealPlans : OptimizedMealPlans) => {
          if(!optimizedMealPlans.error && (optimizedMealPlans.mealPlans && (optimizedMealPlans.mealPlans.optimizationState === "DISTINCT" || optimizedMealPlans.mealPlans.optimizationState === "OPTIMAL" || optimizedMealPlans.mealPlans.optimizationState === "FEASIBLE"))) {
            this.savedMealPlans = optimizedMealPlans.mealPlans;
            this.router.navigate([],{
              relativeTo : this.route,
              queryParams : { optimizermode: 'update' }
            });
            this.disableGetMealPlan = false;
          }
          else { 
            this.savedMealPlans = null;}
        });
  }

  onGetMealPlan() {
    if(this.userPrefs.deliveryDate !== null && this.userPrefs.dietType !==null && this.userPrefs.mealSelected.length === 4) {
      //If all inputs are received, create the order
      let orderRequest = this.orderService.createOrderRequest(this.userPrefs.deliveryDate, this.userPrefs.mealSelected, this.authenticatedUser);    
      //Call backend to get a meal plan
      this.store.dispatch(new OrderActions.UpdateRequestStatus(HttpRequestStatus.REQUEST_SENT));
      this.store.dispatch(new OrderActions.CreateOrderStart(orderRequest));
      this.disableGetMealPlan = true;
    }
    else alert('One of the required inputs is missing');
  }

  onUpdateMealPlan() {
    /* We do not check if this.savedMealPlans !=null since this point is reached 
     * only if the order has been saved atleast once, 
     * if the order has never been saved, the optimizer is in create mode. 
     */
    
    if(this.userPrefs.deliveryDate !== null && this.userPrefs.dietType !==null && this.userPrefs.mealSelected.length === 4)
      console.log('Order ID to be updated ' + this.savedMealPlans.orderId);
  }

  ngOnDestroy() : void {}
}