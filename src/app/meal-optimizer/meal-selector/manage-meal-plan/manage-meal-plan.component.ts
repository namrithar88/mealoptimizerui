import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderService } from 'src/app/shared/services/order.service';
import { OptimizationService } from 'src/app/shared/services/optimization.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/model/user.model';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { UserPreferences } from '../../store/reducers/user-preferences.reducer';
import { AuthenticatedUser } from 'src/app/user-mgmt/store/reducers/user-mgmt.reducer';
import * as OrderActions from '../../store/actions/order.actions';
import { OptimizedMealPlans } from '../../store/reducers/order.reducer';

@Component({
  selector: 'app-manage-meal-plan',
  templateUrl: './manage-meal-plan.component.html',
  styleUrls: ['./manage-meal-plan.component.css']
})
export class ManageMealPlanComponent implements OnInit, OnDestroy {

  disableGetMealPlan : boolean = false;

  disableUpdateMealPlan : boolean = false;
  
  orderInfoUpdated : boolean = false;

  userPrefs : UserPreferences;

  authenticatedUser : User;

  mode : String;

  orderRequest : any;

  constructor(private store : Store<AppState>, private router : Router, private route:ActivatedRoute, private userService : UserService, private optimizationService : OptimizationService, private orderService : OrderService) { }

  ngOnInit(): void {
        // Get value of mode (create or edit)
        this.route.queryParams.subscribe((queryParams : String) => {
          this.mode = queryParams['mode'];
        });

        this.store.select('userPreferences').subscribe((userPrefs : UserPreferences) => {
          this.userPrefs = userPrefs;
        });

        this.store.select('authenticatedUser').subscribe((authenticatedUser : AuthenticatedUser) => {
          this.authenticatedUser = authenticatedUser.user;
        });

        //Switch back to 'create' mode if optimization result state is FAILED OR INFEASIBLE
        this.store.select('optimizedPlans').subscribe((optimizedMealPlans : OptimizedMealPlans) => {
          if(optimizedMealPlans.optimizedMealPlans && ( optimizedMealPlans.optimizedMealPlans.optimizationState === "INFEASIBLE" || optimizedMealPlans.optimizedMealPlans.optimizationState === "FAILED" )) {
            this.router.navigate([],{
              relativeTo : this.route,
              queryParams : { mode: 'create' }
            });
            this.disableGetMealPlan = false;
          }
        });
  }

  onGetMealPlan() {
    if(this.userPrefs.deliveryDate !== null && this.userPrefs.dietType !==null && this.userPrefs.mealSelected.length === 4) {
      //If all inputs are received, create the order
      this.orderRequest = this.orderService.createOrderRequest(this.userPrefs.deliveryDate, this.userPrefs.mealSelected, this.authenticatedUser);    
      //Call backend to get a meal plan
      this.store.dispatch(new OrderActions.CreateOrderStart(this.orderRequest));
      //Change to update mode to allow user to update the inputs if they want
      this.router.navigate(['/meal-optimizer'], { queryParams: {mode: 'update'} });
      this.disableGetMealPlan = true;
    }
    else alert('One of the required inputs is missing');
  }

  onUpdateMealPlan() {
    //If all inputs are received, notify call backend to get a meal plan . If all inputs are not received, display an alert.
    //(this.userPrefs.deliveryDate !== null && this.userPrefs.dietType !==null && this.userPrefs.mealSelected.length === 4)?console.log('Send update request to backend'):alert('One of the required inputs is missing');
    this.disableUpdateMealPlan = true; 
  }

  ngOnDestroy() : void {}
}