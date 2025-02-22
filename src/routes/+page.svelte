<script lang="ts">
  import type NutritionInfo from '$lib/types/NutritionInfo'

  let search = $state('')
  let results = $state([] as NutritionInfo[])
  let storedResults = $state([] as NutritionInfo[])
  
  function updateServing(result: NutritionInfo, newServing: number) {
    if (!newServing || newServing < 1) {
      return;
    }
    // Find the original values from storedResults
    const originalResult = storedResults.find(r => r.name === result.name);
    if (!originalResult) return;
    
    const ratio = newServing / Number(originalResult.serving);
    result.serving = newServing.toString();
    result.calories = Math.round(originalResult.calories * ratio);
    result.proteins = Math.round(originalResult.proteins * ratio * 10) / 10;
    result.carbs = Math.round(originalResult.carbs * ratio * 10) / 10;
    result.fat = Math.round(originalResult.fat * ratio * 10) / 10;
    result.fiber = Math.round(originalResult.fiber * ratio * 10) / 10;
    results = [...results];
  }

  function fetchData() {
    fetch(`/db?search=${search}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        storedResults = [...storedResults, ...data]
        results = [...results, ...data]
        search = ''
      })
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/fontawesome/css/all.min.css">
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
  {#if results.length > 0}
  <div class="content">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Calories</th>
          <th>Protein (g)</th>
          <th>Carbs (g)</th>
          <th>Fat (g)</th>
          <th>Fiber (g)</th>
          <th>Serving</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {#each results as result}
          <tr>
            <td>{result.name}</td>
            <td>{result.calories}</td>
            <td>{result.proteins}</td>
            <td>{result.carbs}</td>
            <td>{result.fat}</td>
            <td>{result.fiber}</td>
            <td>
              <input
                type="number"
                value={result.serving}
                min="1"
                step="0.1"
                oninput={(e) => updateServing(result, parseFloat(e.currentTarget.value))}
              />
            </td>
            <td>{result.serving_unit}</td>
          </tr>
        {/each}
        <tr class="totals-row">
          <td>Totals</td>
          <td>{results.reduce((sum, item) => sum + item.calories, 0)}</td>
          <td>{results.reduce((sum, item) => sum + item.proteins, 0)}</td>
          <td>{results.reduce((sum, item) => sum + item.carbs, 0)}</td>
          <td>{results.reduce((sum, item) => sum + item.fat, 0)}</td>
          <td>{results.reduce((sum, item) => sum + item.fiber, 0)}</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  </div>
  {:else}
    <h2 class="no-results">Add a food to start tracking your calories</h2>
  {/if}
</div>