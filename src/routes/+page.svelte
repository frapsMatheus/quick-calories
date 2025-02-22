<script lang="ts">
  import '../styles/main.scss';
  
  import { nutritionResults, updateServing } from '$lib/components/shared.svelte'
  import NutritionCard from '$lib/components/NutritionCard/NutritionCard.svelte';

  let search = $state('')

  function fetchData() {
    fetch(`/db?search=${search}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        nutritionResults.storedResults = [...data, ...nutritionResults.storedResults ]
        nutritionResults.results = [...data, ...nutritionResults.results ]
        search = ''
      })
  }
</script>

<svelte:head>
  <link 
    rel="stylesheet" 
    href="/fontawesome/css/all.min.css"   
    media="print"
    onload={(e) => {
      (e.currentTarget as HTMLLinkElement).media = 'all';
      (e.currentTarget as HTMLLinkElement).onload = null;
    }}
  />
</svelte:head>

<div class="landing-page container">
  <div class="hero">
    <h1>QUICK CALORIES</h1>
    <h3>Get the nutritional information of your favorite foods in seconds</h3>
    
    <div class="search-container"> 
      <input 
        type="text" 
        bind:value={search}
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            fetchData();
          }
        }}
        placeholder="Search for food..."
      />
      <button onclick={fetchData} aria-label="Search">
        <i class="fas fa-circle-right"></i>
      </button>
    </div>
  </div>
  {#if nutritionResults.results.length > 0}
  <div class="content">
    <NutritionCard 
      name="Totals" 
      calories={nutritionResults.results.reduce((sum, r) => sum + r.calories, 0)}
      proteins={nutritionResults.results.reduce((sum, r) => sum + r.proteins, 0)} 
      carbs={nutritionResults.results.reduce((sum, r) => sum + r.carbs, 0)}
      fat={nutritionResults.results.reduce((sum, r) => sum + r.fat, 0)}
      fiber={nutritionResults.results.reduce((sum, r) => sum + r.fiber, 0)}
    />
    {#each nutritionResults.results as result, index}
      <NutritionCard position={index} name={result.name} calories={result.calories} proteins={result.proteins} carbs={result.carbs} fat={result.fat} fiber={result.fiber} serving={result.serving} serving_unit={result.serving_unit} />
    {/each}
  </div>
  {:else}
    <h2 class="no-results">Add a food to start tracking your calories</h2>
  {/if}
</div>