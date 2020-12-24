import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { UserPreferences } from '../store/reducers/user-preferences.reducer';
import * as RecipesActions from '../../../meal-planner/recipes/store/actions/recipes.actions';
import { OptimizedMealPlans } from '../store/reducers/order.reducer';
import { OptimizationStatus } from 'src/app/shared/services/optimization-status.enum';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-optimized-meal-plan',
  templateUrl: './optimized-meal-plan.component.html',
  styleUrls: ['./optimized-meal-plan.component.css']
})
/*
 * This component has 2 sections:
 * Sec. 1: Display optimization results
 * Sec. 2: Handle optimization results (Get Recipe / Place Order)
 * 
 * It handles 3 tasks:
 * (1) Allows the user to place online order/get recipe only if the below conditions are met:
 *     -> The optimized meal plans have state DISTINCT/OPTIMAL/FEASIBLE. All other states are negative i.e. a meal plan that satisfies all nutitional requirements could not be created for the selected meals.
 *     -> Either Optimized by Cost or Optimized by Quality was selected
 * (2) Reroute the user to either recipes section or online order section based on option selected. The correct secion is loaded based on the route.
 * (3) Display help text 'Select a different meal plan' if meal plan cannot be created from meals selected (optimization state !== DISTINCT | OPTIMAL | FEASIBLE)
 */
export class OptimizedMealPlanComponent implements OnInit, OnDestroy {

  // Allow user to place online order / get recipe based on value in userPreferences.optimizationTypeSelected (optimize by cost | optimize by quality)
  userPreferences : UserPreferences;

  // Display help text if optimization state != DISTINCT | OPTIMAL | FEASIBLE
  optimizationState : String;
  
  isValidOptimizationState : boolean;

  constructor(private router : Router, private store : Store<AppState>, private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.store.select('userPreferences').subscribe((userPrefs : UserPreferences) => {
      this.userPreferences = userPrefs;
    });

    this.store.select('optimizedPlans').subscribe((optimizedMealPlans : OptimizedMealPlans) => {
      if(optimizedMealPlans.optimizedMealPlans)
      this.optimizationState = optimizedMealPlans.optimizedMealPlans.optimizationState;

      if(optimizedMealPlans.status !== OptimizationStatus.RESPONSE_RECEIVED) {
      this.isValidOptimizationState = true;
      } else {
          if(this.optimizationState === 'DISTINCT' || this.optimizationState === 'OPTIMAL' || this.optimizationState === 'FEASIBLE') this.isValidOptimizationState = true;
          else this.isValidOptimizationState = false;
      }
    });
  }

  get allowUserToPlaceOrderOrGetRecipe() : boolean {
    if(this.userPreferences.optimizationTypeSelected && this.userPreferences.optimizationTypeSelected !== 'orderInfo' && this.isValidOptimizationState) return true;
    else return false;
  }

  placeOrderSelected() {
    this.router.navigate([ 'meal-planner' , { outlets : { mealoptimizer : 'meal-optimizer', recipes : ['recipes'] } }] ,  { queryParams : this.route.snapshot.queryParams });
  }

  getRecipeSelected() {
    this.store.dispatch(new RecipesActions.FetchRecipesStart(this.userPreferences.mealSelected));
    this.router.navigate([ 'meal-planner' , { outlets : { mealoptimizer : 'meal-optimizer', recipes : ['recipes'] } }] , { queryParams : this.route.snapshot.queryParams });
  }

  ngOnDestroy() { }
}