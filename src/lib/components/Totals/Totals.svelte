<script lang="ts">
  import CaloriesIcon from '$lib/icons/calories.svelte';
  import ProteinIcon from '$lib/icons/protein.svelte';
  import CarbsIcon from '$lib/icons/carbs.svelte';
  import OilIcon from '$lib/icons/oil.svelte';
  import './Totals.scss';
  let { calories, proteins, carbs, fat } : { calories: number, proteins: number, carbs: number, fat: number } = $props();
</script>

<div class="totals-card">
  <div class="totals-card-header">
    <p>{calories}</p>
    <CaloriesIcon color="var(--secondary)" />
  </div>
  <div class="totals-card-body">
    <div class="totals-card-body-item">
      <ProteinIcon color="var(--secondary)" />
      <p>{proteins.toFixed(2)}</p>
      <div class="totals-card-body-item-icon"> Proteins</div>
    </div>
    <div class="totals-card-body-item">
      <CarbsIcon color="var(--secondary)" />
      <p>{carbs.toFixed(2)}</p>
      <div class="totals-card-body-item-icon"> Carbs</div>
    </div>
    <div class="totals-card-body-item">
      <OilIcon color="var(--secondary)" />
      <p>{fat.toFixed(2)}</p>
      <div class="totals-card-body-item-icon"> Fat</div>
    </div>
  </div>
</div>