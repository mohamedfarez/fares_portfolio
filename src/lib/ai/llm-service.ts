import OpenAI from 'openai';

// API Configuration
interface APIConfig {
  name: string;
  apiKey: string;
  baseURL?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
}

interface LLMRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
}

export class LLMService {
  private apis: APIConfig[] = [
    {
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4o-mini',
      maxTokens: 1000,
      temperature: 0.7
    },
    {
      name: 'Google AI Studio',
      apiKey: process.env.GOOGLE_AI_STUDIO_KEY || '',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-1.5-flash',
      maxTokens: 1000,
      temperature: 0.7
    },
    {
      name: 'Cerebras',
      apiKey: process.env.CEREBRAS_API_KEY || '',
      baseURL: 'https://api.cerebras.ai/v1',
      model: 'llama3.1-8b',
      maxTokens: 1000,
      temperature: 0.7
    }
  ];

  private currentAPIIndex = 0;
  private failedAPIs = new Set<number>();

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    let lastError: Error | null = null;

    // Try each API in order, skipping failed ones
    for (let attempt = 0; attempt < this.apis.length; attempt++) {
      const apiIndex = (this.currentAPIIndex + attempt) % this.apis.length;
      
      // Skip if this API has failed recently
      if (this.failedAPIs.has(apiIndex)) {
        continue;
      }

      const api = this.apis[apiIndex];
      
      try {
        console.log(`🔄 Attempting ${api.name} API...`);
        const response = await this.callAPI(api, request);
        
        // Success! Update current API and clear failed APIs
        this.currentAPIIndex = apiIndex;
        this.failedAPIs.clear();
        
        console.log(`✅ Success with ${api.name}`);
        return response;
        
      } catch (error) {
        console.error(`❌ ${api.name} failed:`, error);
        lastError = error as Error;
        
        // Mark this API as failed
        this.failedAPIs.add(apiIndex);
        
        // If this was a rate limit or temporary error, don't mark as permanently failed
        if (this.isTemporaryError(error)) {
          setTimeout(() => {
            this.failedAPIs.delete(apiIndex);
          }, 60000); // Retry after 1 minute
        }
      }
    }

    // All APIs failed, throw the last error
    throw new Error(`All LLM APIs failed. Last error: ${lastError?.message}`);
  }

  private async callAPI(api: APIConfig, request: LLMRequest): Promise<LLMResponse> {
    switch (api.name) {
      case 'OpenAI':
        return await this.callOpenAI(api, request);
      case 'Google AI Studio':
        return await this.callGoogleAI(api, request);
      case 'Cerebras':
        return await this.callCerebras(api, request);
      default:
        throw new Error(`Unknown API: ${api.name}`);
    }
  }

  private async callOpenAI(api: APIConfig, request: LLMRequest): Promise<LLMResponse> {
    const openai = new OpenAI({
      apiKey: api.apiKey,
    });

    const response = await openai.chat.completions.create({
      model: api.model,
      messages: request.messages,
      temperature: request.temperature ?? api.temperature,
      max_tokens: request.maxTokens ?? api.maxTokens,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    return {
      content,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
      provider: 'OpenAI'
    };
  }

  private async callGoogleAI(api: APIConfig, request: LLMRequest): Promise<LLMResponse> {
    // Convert messages to Google AI format
    const contents = this.convertMessagesToGoogleFormat(request.messages);
    
    const response = await fetch(`${api.baseURL}/models/${api.model}:generateContent?key=${api.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: request.temperature ?? api.temperature,
          maxOutputTokens: request.maxTokens ?? api.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content in Google AI response');
    }

    return {
      content,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount,
      } : undefined,
      provider: 'Google AI Studio'
    };
  }

  private async callCerebras(api: APIConfig, request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch(`${api.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api.apiKey}`,
      },
      body: JSON.stringify({
        model: api.model,
        messages: request.messages,
        temperature: request.temperature ?? api.temperature,
        max_tokens: request.maxTokens ?? api.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in Cerebras response');
    }

    return {
      content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
      provider: 'Cerebras'
    };
  }

  private convertMessagesToGoogleFormat(messages: Array<{role: string, content: string}>) {
    const contents = [];
    let systemMessage = '';

    for (const message of messages) {
      if (message.role === 'system') {
        systemMessage = message.content;
      } else {
        contents.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: systemMessage ? `${systemMessage}\n\n${message.content}` : message.content }]
        });
        systemMessage = ''; // Only add system message to first user message
      }
    }

    return contents;
  }

  private isTemporaryError(error: any): boolean {
    const errorMessage = error?.message?.toLowerCase() || '';
    return errorMessage.includes('rate limit') || 
           errorMessage.includes('timeout') || 
           errorMessage.includes('503') || 
           errorMessage.includes('502');
  }

  // Get current API status
  getAPIStatus() {
    return this.apis.map((api, index) => ({
      name: api.name,
      status: this.failedAPIs.has(index) ? 'failed' : 'active',
      isCurrent: index === this.currentAPIIndex
    }));
  }
}

// Singleton instance
export const llmService = new LLMService();
