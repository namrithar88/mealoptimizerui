import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Meal } from '../model/order/order-response.model';
import { OrderResponse } from '../model/order/order-response.model';
import { UserInputService } from './user-input.service';

@Injectable({providedIn:'root'})
export class OptimizationService {

    mealPlanCost : { mealListByCost : Meal[], planCost: number } = { mealListByCost : new Array<Meal>(), planCost: 0.0 };

    mealPlanQuality : { mealListByQuality : Meal[], planCost: number } = { mealListByQuality : new Array<Meal>(), planCost: 0.0 };

    onCostOptimizationComplete = new Subject< { mealListByCost : Meal[], planCost: number } >();
    onQualityOptimizationComplete = new Subject< { mealListByQuality : Meal[], planCost: number } >();

    constructor(private userInputService:UserInputService) {}

    getOptimizationResultSummary() : {totalCost: number, totalCalories: number} {
        return { totalCost: 39.9, totalCalories: 1938};
    }

    getPortionCountByOptimizationTypeMealName(optimizationType:String, mealName : String) : number {
        var portionCount = 0;
        switch(optimizationType) {
            case 'optimizedByCost': 
                this.mealPlanCost.mealListByCost.forEach((meal) => {
                    if(mealName.toLowerCase() === meal.itemName.toLowerCase())
                        portionCount = meal.portion;
                    }
                );
                break;
            case 'optimizedByQuality':
                this.mealPlanQuality.mealListByQuality.forEach((meal) => {
                    if(mealName.toLowerCase() === meal.itemName.toLowerCase())
                        portionCount = meal.portion;
                });
                break;                     
        }
        return portionCount;
    }

    setOptimizedMealPlans(orderResponse : OrderResponse) {
        console.log(orderResponse);
        orderResponse.mealPlan.forEach((mealPlan) => {
            if(mealPlan.optimizationType === "COST") {
                this.mealPlanCost.mealListByCost = mealPlan.meals;
                this.mealPlanCost.planCost = mealPlan.mealPlanCost;
            }
            if(mealPlan.optimizationType === "REWARD") {
                mealPlan.meals.forEach(meal => { console.log(meal.itemName + ' - ' + meal.mealCost + ' - ' + meal.portion); });
                this.mealPlanQuality.mealListByQuality = mealPlan.meals;
                this.mealPlanQuality.planCost = mealPlan.mealPlanCost;
            }
        });
        this.onCostOptimizationComplete.next(this.mealPlanCost);
        this.onQualityOptimizationComplete.next(this.mealPlanQuality);
    }
}