import { BusinessScenario, Solution } from "@/types/dashboard";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro";

interface BusinessContext {
  revenue: string;
  growth: string;
  profitMargin: string;
  cashFlow: string;
  departmentMetrics: {
    [key: string]: {
      efficiency: number;
      morale: number;
      innovation: number;
    };
  };
}

/**
 * Cleans and validates JSON strings from the Gemini API response
 * 
 * This function implements a multi-stage cleaning process:
 * 1. Attempts direct parsing first
 * 2. If that fails, applies cleaning steps:
 *    - Removes markdown and comments
 *    - Normalizes different quote types
 *    - Handles nested quotes correctly
 *    - Cleans up various JSON syntax issues
 * 3. Validates and re-stringifies the result
 * 
 * @param str - The raw JSON string to clean
 * @returns A valid JSON string
 * @throws Error if the string cannot be parsed or cleaned into valid JSON
 */
function cleanJsonString(str: string): string {
  try {
    // First attempt: try parsing as-is
    JSON.parse(str);
    return str;
  } catch (e: unknown) {
    const originalError = e instanceof Error ? e : new Error(String(e));
    // If parsing fails, apply cleaning steps
    try {
      // Remove markdown and comments
      str = str.replace(/```json\s*|\s*```/g, '')
               .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
               .trim();

      // Fix any text before/after JSON object
      str = str.replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1');

      // Handle escaped quotes properly
      // First, temporarily replace already correctly escaped quotes
      // First pass: normalize all quotes to standard format
      str = str.replace(/`/g, '"')                         // Replace backticks with quotes
               .replace(/['']/g, "'")                      // Normalize single quotes
               .replace(/[""]/g, '"');                     // Normalize double quotes

      str = str.replace(/\\"/g, '__ESCAPED_QUOTE__');     // Save properly escaped quotes
      
      // Fix property names quotes
      str = str.replace(/([{,]\s*)(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '$1"$3":')
               .replace(/:\s*'([^']*)'/g, ':"$1"');       // Convert string values to double quotes
      
      // Handle nested quotes in string values
      str = str.replace(/"([^"]*)":/g, (match) => match); // Keep property quotes intact
      str = str.replace(/"([^"]+)"/g, (match, content) => {
        // Triple pass to handle deeply nested quotes
        let processed = content;
        for (let i = 0; i < 3; i++) {
          processed = processed.replace(/(?<!\\)"/g, '\\"');
        }
        return `"${processed}"`;
      });
      
      str = str.replace(/__ESCAPED_QUOTE__/g, '\\"');     // Restore saved escaped quotes

      // Clean up other issues
      str = str
        // Remove trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Handle escaped newlines
        .replace(/\\n/g, ' ')
        // Remove invalid control characters
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '');

      // Final validation
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed); // Re-stringify to ensure proper formatting
    } catch (error: unknown) {
      const cleanError = error instanceof Error ? error : new Error(String(error));
      // Enhanced error logging for better debugging
      console.error("JSON Cleaning Error Details:");
      console.error("1. Original Error:", originalError.message);
      console.error("2. Cleaning Error:", cleanError.message);
      console.error("3. Original String:", str);
      console.error("4. Last Known Good State:", JSON.stringify({
        hasMarkdown: /```/.test(str),
        hasEscapedQuotes: /\\"/.test(str),
        hasUnescapedQuotes: /"[^"]*"[^":,\s}]/.test(str),
        length: str.length
      }));
      throw new Error("Unable to parse or clean JSON response");
    }
  }
}

/**
 * Makes a request to the Gemini API with the given prompt
 * 
 * @param prompt - The text prompt to send to the Gemini API
 * @returns A cleaned JSON string response from the API
 * @throws Error if the API request fails or returns invalid data
 */
async function callGeminiAPI(prompt: string) {
  try {
    const response = await fetch(`${GEMINI_API_URL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`Failed to call Gemini API: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    return cleanJsonString(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Generates a business scenario based on the provided metrics and department performance
 * 
 * @param context - Business metrics and department performance data
 * @returns A business scenario with solutions
 * @throws Error if scenario generation or JSON parsing fails
 */
export async function generateBusinessScenario(context: BusinessContext): Promise<BusinessScenario> {
  const prompt = `
    You are acting as an advanced business simulation AI. Generate a detailed business scenario based on the following metrics:
    - Annual Revenue: ${context.revenue}
    - Revenue Growth: ${context.growth}
    - Profit Margin: ${context.profitMargin}
    - Cash Flow: ${context.cashFlow}
    
    And department performance:
    ${Object.entries(context.departmentMetrics)
      .map(([dept, metrics]) => 
        `${dept}:
        - Efficiency: ${metrics.efficiency}%
        - Morale: ${metrics.morale}%
        - Innovation: ${metrics.innovation}%`
      ).join("\n")}
    
    Return a valid JSON object in this exact format ONLY. Ensure all quotes within string values are properly escaped with backslashes. Do not include any explanation text:
    {
      "description": "A detailed description of the business scenario",
      "complexity": 3,
      "solutions": [
        {
          "description": "Detailed solution description",
          "impacts": {
            "revenue": 10,
            "morale": -5,
            "efficiency": 15
          },
          "explanation": "Reasoning behind the impacts"
        }
      ]
    }
  `.trim();

  try {
    const response = await callGeminiAPI(prompt);
    const scenarioData = JSON.parse(response);

    return {
      id: Math.random().toString(36).substr(2, 9),
      description: scenarioData.description,
      complexity: scenarioData.complexity,
      solutions: scenarioData.solutions.map((sol: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        ...sol
      }))
    };
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
}

/**
 * Generates a specialized solution recommendation for a given business scenario
 * 
 * @param scenario - The business scenario to generate a solution for
 * @param context - Business metrics to consider for the solution
 * @returns A solution with impact metrics and explanation
 * @throws Error if solution generation or JSON parsing fails
 */
export async function getSpecialProjectsRecommendation(
  scenario: BusinessScenario,
  context: BusinessContext
): Promise<Solution> {
  const prompt = `
    You are an elite business consultant AI. Generate an innovative solution for this scenario:
    "${scenario.description}"
    
    Consider these metrics:
    - Annual Revenue: ${context.revenue}
    - Revenue Growth: ${context.growth}
    - Profit Margin: ${context.profitMargin}
    - Cash Flow: ${context.cashFlow}
    
    Return a valid JSON object in this exact format ONLY. Ensure all quotes within string values are properly escaped with backslashes. Do not include any explanation text:
    {
      "description": "Detailed innovative solution",
      "impacts": {
        "revenue": 20,
        "morale": 10,
        "efficiency": 15
      },
      "explanation": "Detailed reasoning and implementation strategy"
    }
  `.trim();

  try {
    const response = await callGeminiAPI(prompt);
    const solutionData = JSON.parse(response);

    return {
      id: Math.random().toString(36).substr(2, 9),
      ...solutionData
    };
  } catch (error) {
    console.error("Error generating special projects solution:", error);
    throw error;
  }
}
