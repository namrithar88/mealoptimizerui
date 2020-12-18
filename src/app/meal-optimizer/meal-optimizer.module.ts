import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { MealOptimizerRoutingModule } from '../meal-optimizer/meal-optimizer.routing.module';
import { MealOptimizerComponent } from './meal-optimizer.component';
import { DeliveryDateSelectorComponent } from '../meal-optimizer/delivery-date-selector/delivery-date-selector.component';
import { MealSelectorComponent } from '../meal-optimizer/meal-selector/meal-selector.component';
import { ManageMealPlanComponent } from '../meal-optimizer/meal-selector/manage-meal-plan/manage-meal-plan.component';
import { MealOptionsComponent } from '../meal-optimizer/meal-selector/meal-options/meal-options.component';
import { OptimizedMealPlanComponent } from '../meal-optimizer/optimized-meal-plan/optimized-meal-plan.component';
import { OptimizedResultsTableComponent } from '../meal-optimizer/optimized-meal-plan/optimized-results-table/optimized-results-table.component';
import { OptimizedResultCostComponent } from '../meal-optimizer/optimized-meal-plan/optimized-results-table/optimized-result-cost/optimized-result-cost.component';
import { OptimizedResultQualityComponent } from '../meal-optimizer/optimized-meal-plan/optimized-results-table/optimized-result-quality/optimized-result-quality.component';
import { OrderInfoComponent } from '../meal-optimizer/optimized-meal-plan/optimized-results-table/order-info/order-info.component';
import { OrderSummaryComponent } from '../meal-optimizer/optimized-meal-plan/order-summary/order-summary.component';
import { UserDietTypeComponent } from '../meal-optimizer/user_diet_type/user_diet_type.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { ShoppingListComponent } from './recipes/shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './recipes/shopping-list/shopping-edit/shopping-edit.component';

@NgModule({
    declarations : [
        DeliveryDateSelectorComponent,
        MealSelectorComponent,
        ManageMealPlanComponent,
        MealOptionsComponent,
        OptimizedMealPlanComponent,
        OptimizedResultsTableComponent,
        OptimizedResultCostComponent,
        OptimizedResultQualityComponent,
        OrderInfoComponent,
        OrderSummaryComponent,
        UserDietTypeComponent,
        MealOptimizerComponent,
        RecipesComponent,
        RecipeDetailComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports : [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
          }),
        MealOptimizerRoutingModule
    ],
    providers : [ DatePipe ]
})
export class MealOptimizerModule {}