import { ChatMessage, SearchResult } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const defaultConfig: GroqConfig = {
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  model: 'moonshotai/kimi-k2-instruct',
  temperature: 0.6,
  maxTokens: 4096,
};

export async function* streamCompletion(
  messages: ChatMessage[],
  config: Partial<GroqConfig> = {}
): AsyncGenerator<string, void, unknown> {
  const mergedConfig = { ...defaultConfig, ...config };
  
  if (!mergedConfig.apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mergedConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: mergedConfig.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: mergedConfig.temperature,
      max_tokens: mergedConfig.maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq API error');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}

export function getChatCompletion(
  messages: ChatMessage[],
  config: Partial<GroqConfig> = {}
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      const generator = streamCompletion(messages, config);
      
      for await (const chunk of generator) {
        fullResponse += chunk;
      }
      
      resolve(fullResponse);
    } catch (error) {
      reject(error);
    }
  });
}
