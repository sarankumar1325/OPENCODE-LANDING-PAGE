export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'search';
  content: string;
  timestamp: number;
}
