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
  
  async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    isEmptyResult: (result: T) => boolean
  ): Promise<T | null> {
    try {
      let lastResult: T | null = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);
        lastResult = await operation();
        
        if (!isEmptyResult(lastResult)) {
          return lastResult;
        }
      }
      
      return lastResult;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  try {
    const aiData = await retryOperation(
      () => extractNutritionInfo(search),
      2,
      (result) => !result || result.length === 0
    );

    if (!aiData || aiData.length === 0) {
      return new Response('No nutrition information found', { status: 404 });
    }

    return new Response(JSON.stringify(aiData), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error extracting nutrition info', { status: 500 })
  }
}