import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import type NutritionInfo from '../types/NutritionInfo';
import { nutritionPrompt } from './prompt';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);

const responseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    required: ['name', 'name_english', 'calories', 'proteins', 'carbs', 'fat', 'fiber', 'serving', 'serving_unit'],
    properties: {
      name: { type: SchemaType.STRING },
      name_english: { type: SchemaType.STRING },
      calories: { type: SchemaType.NUMBER },
      proteins: { type: SchemaType.NUMBER },
      carbs: { type: SchemaType.NUMBER },
      fat: { type: SchemaType.NUMBER },
      fiber: { type: SchemaType.NUMBER },
      serving: { type: SchemaType.NUMBER },
      serving_unit: { 
        type: SchemaType.STRING,
        enum: [
          'g',      // grams
          'ml',     // milliliters
          'cup',    // cups
          'tbsp',   // tablespoons
          'tsp',    // teaspoons
          'oz',     // ounces
          'piece',  // individual pieces
          'slice',  // slices
          'unit'    // generic units
        ]
      },
    }
  }
};

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',   
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: responseSchema,
  },
});
const chat = model.startChat();
await chat.sendMessage(nutritionPrompt);

export async function extractNutritionInfo(text: string): Promise<NutritionInfo[]> {
  try {
    if (text.length > 100) {
      text = text.substring(0, 100);
    }
    const result = await chat.sendMessage(text);
    const response = await result.response;
    const jsonString = response.text();
    console.log(jsonString)
    
    // Clean up the JSON string before parsing
    const cleanJsonString = jsonString.replace(/```json/, '').replace(/```/, '').replace(/\n/g, '').trim();
    const nutritionList = JSON.parse(cleanJsonString) as NutritionInfo[];
    
    // Verify all items in the array have the required fields
    for (const nutrition of nutritionList) {
      if (
        typeof nutrition.name !== 'string' ||
        typeof nutrition.name_english !== 'string' ||
        typeof nutrition.calories !== 'number' ||
        typeof nutrition.proteins !== 'number' ||
        typeof nutrition.carbs !== 'number' ||
        typeof nutrition.fat !== 'number' ||
        typeof nutrition.fiber !== 'number' ||
        typeof nutrition.serving !== 'number' ||
        typeof nutrition.serving_unit !== 'string' ||
        nutrition.name === 'Not found'
      ) {
        throw new Error('Invalid response format from AI');
      }
    }
    // Capitalize the first letter of each word in the name
    for (const nutrition of nutritionList) {
      nutrition.name = nutrition.name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      nutrition.name_english = nutrition.name_english.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    return nutritionList;
  } catch (error) {
    console.error('Error extracting nutrition info:', error);
    throw new Error('Failed to extract nutrition information');
  }
}
