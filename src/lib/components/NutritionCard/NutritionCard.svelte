<script lang="ts"> 
  import './NutritionCard.scss';
  import { updateServing } from '$lib/components/shared.svelte';
  let { position = undefined, name, calories, proteins, carbs, fat, fiber, serving = undefined, serving_unit = undefined } : { position?: number, name: string, calories: number, proteins: number, carbs: number, fat: number, fiber: number, serving?: number, serving_unit?: string } = $props();
  let servingValue = $state(serving || 0);
</script>

<!-- TODO: Use more icons for the nutrition card -->
<div class="nutrition-card">
  <div class="nutrition-card-header">
    <p class="name">{name}</p>
    <p class="calories"><span>{calories}</span> calories</p>
  </div>
  <div class="nutrition-card-body">
    <p><span>{proteins.toFixed(2)}g</span> protein</p>
    <p><span>{carbs.toFixed(2)}g</span> carbs</p>
    <p><span>{fat.toFixed(2)}g</span> fat</p>
    <p><span>{fiber.toFixed(2)}g</span> fiber</p>
    {#if position !== undefined}
      <p class="serving-input">
        <input 
          type="number" 
          bind:value={servingValue} 
          oninput={() => updateServing(position, servingValue)}
        />
        <span class="unit">{serving_unit}</span>
      </p>
    {/if}
  </div>
</div>