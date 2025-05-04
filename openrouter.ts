import { HttpsProxyAgent } from 'https-proxy-agent';

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  // Add other fields if needed based on API response
}

// Retrieve the API key from environment variables for security
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Use proxy agent if necessary in the sandbox environment
const agent = process.env.https_proxy ? new HttpsProxyAgent(process.env.https_proxy) : undefined;

export async function callOpenRouter(prompt: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key not configured.");
    throw new Error("API Key for AI generation is missing.");
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        // 'HTTP-Referer': 'YOUR_SITE_URL', // Optional: Replace with your site URL
        // 'X-Title': 'YOUR_SITE_NAME', // Optional: Replace with your site name
      },
      body: JSON.stringify({
        model: "openai/gpt-4o", // Or your preferred model
        messages: [
          { role: "system", content: "Você é um especialista em marketing digital e copywriting. Sua tarefa é gerar conteúdo completo para vender produtos digitais." },
          { role: "user", content: prompt }
        ],
        // max_tokens: 1500, // Optional: Adjust token limit if needed
        // temperature: 0.7, // Optional: Adjust creativity
      }),
      agent: agent, // Use proxy agent if defined
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}): ${errorBody}`);
      throw new Error(`Failed to fetch from OpenRouter: ${response.statusText}`);
    }

    const data = await response.json() as OpenRouterResponse;

    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("Invalid response structure from OpenRouter:", data);
      throw new Error("Failed to parse response from OpenRouter.");
    }

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    // Return null or throw a more specific error to be handled upstream
    return null; 
  }
}

