import type NutritionInfo from '$lib/types/NutritionInfo'

export let nutritionResults = $state({
  results: [] as NutritionInfo[],
  storedResults: [] as NutritionInfo[]
})

export function deleteItem(position: number) {
  const newStoredResults = nutritionResults.storedResults.filter((_, index) => index !== position);
  const newResults = nutritionResults.results.filter((_, index) => index !== position);
  nutritionResults.storedResults = [...newStoredResults];
  nutritionResults.results = [...newResults];
}

export function updateServing(position: number, newServing: number) {
  if (!newServing || newServing < 1) {
    return;
  }
  // Find the original values from storedResults
  const originalResult = nutritionResults.storedResults[position];
  if (!originalResult) return;
  
  const ratio = newServing / Number(originalResult.serving);
  nutritionResults.results[position].serving = newServing;
  nutritionResults.results[position].calories = Math.round(originalResult.calories * ratio);
  nutritionResults.results[position].proteins = Math.round(originalResult.proteins * ratio * 10) / 10;
  nutritionResults.results[position].carbs = Math.round(originalResult.carbs * ratio * 10) / 10;
  nutritionResults.results[position].fat = Math.round(originalResult.fat * ratio * 10) / 10;
  nutritionResults.results[position].fiber = Math.round(originalResult.fiber * ratio * 10) / 10;
  nutritionResults.results = [...nutritionResults.results];
}