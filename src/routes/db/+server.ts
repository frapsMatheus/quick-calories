import { extractNutritionInfo } from '$lib/server/ai';
import supabase from '$lib/server/database'
import { rateLimiter } from '$lib/server/rateLimiter';

export async function GET({ url, getClientAddress }: { url: URL; getClientAddress: () => string }) {  
  const rateLimit = rateLimiter(getClientAddress());
  if (rateLimit.error) {
    return new Response(rateLimit.message, { status: 429 })
  }

  const search = url.searchParams.get('search');
  if (!search) {
    return new Response('No search parameter provided', { status: 400 })
  }

  // const { data, error } = await supabase
  //   .from('ingredients')
  //   .select('*')
  //   .ilike('name', `${search}`)
  
  // if (data && data.length > 0) {
  //   return new Response(JSON.stringify(data[0]), { status: 200 })
  // }
  
  try {
    const aiData = await extractNutritionInfo(search);
    console.log(aiData);
    // for (const item of aiData) {
    //   const { error: insertError } = await supabase.from('ingredients').insert({
    //     name: item.name,
    //     calories: item.calories,
    //     proteins: item.proteins,
    //     carbs: item.carbs,
    //     fat: item.fat,
    //     fiber: item.fiber,
    //     serving: item.serving,
    //     serving_unit: item.serving_unit
    //   });
    //   if (insertError) {
    //     console.error('Insert error:', insertError);
    //   }
    // }

    return new Response(JSON.stringify(aiData), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error extracting nutrition info', { status: 500 })
  }
}