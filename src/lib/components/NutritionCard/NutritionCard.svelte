<script lang="ts"> 
  import './NutritionCard.scss';
  import { updateServing } from '$lib/components/shared.svelte';
  import CaloriesIcon from '$lib/icons/calories.svelte';
  import ProteinIcon from '$lib/icons/protein.svelte';
  import CarbsIcon from '$lib/icons/carbs.svelte';
  import OilIcon from '$lib/icons/oil.svelte';
  import FiberIcon from '$lib/icons/fiber.svelte';
  let { position = undefined, name, calories, proteins, carbs, fat, fiber, serving = undefined, serving_unit = undefined } : { totals?: boolean, position?: number, name: string, calories: number, proteins: number, carbs: number, fat: number, fiber: number, serving?: number, serving_unit?: string } = $props();
</script>

<div class="nutrition-card">
  <div class="nutrition-card-header">
    <p class="name">{name}</p>
    <div class="calories">
      <span>{calories}</span><span class="icon"><CaloriesIcon /></span>
    </div>
  </div>
  <div class="nutrition-card-body">
    <div class="nutrition-card-body-item">
      <span>{proteins.toFixed(2)}g</span><span class="icon"><ProteinIcon /></span>
    </div>
    <div class="nutrition-card-body-item">
      <span>{carbs.toFixed(2)}g</span><span class="icon"><CarbsIcon /></span>
    </div>
    <div class="nutrition-card-body-item">
      <span>{fat.toFixed(2)}g</span><span class="icon"><OilIcon /></span>
    </div>
    <div class="nutrition-card-body-item">
      <span>{fiber.toFixed(2)}g</span><span class="icon"><FiberIcon /></span>
    </div>
    {#if position !== undefined}
      <div class="nutrition-card-body-item serving-input">
        <input 
          type="number" 
          bind:value={serving} 
          oninput={() => updateServing(position, serving || 0)}
        />
        <span class="unit">{serving_unit}</span>
      </div>
    {/if}
  </div>
</div>