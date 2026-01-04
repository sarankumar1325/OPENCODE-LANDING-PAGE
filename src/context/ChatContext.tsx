import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, TerminalLine } from '../types';
import { getChatCompletion, streamCompletion } from '../services/groq';
import { searchWeb, shouldSearchWeb } from '../services/tavily';

interface ChatAction {
  type: 'ADD_LINE' | 'SET_LOADING' | 'SET_ERROR' | 'CLEAR' | 'UPDATE_LAST_LINE' | 'SET_HISTORY' | 'SET_HISTORY_INDEX';
  payload?: any;
}

interface ChatState {
  lines: TerminalLine[];
  isLoading: boolean;
  error: string | null;
  history: string[];
  historyIndex: number;
}

const initialState: ChatState = {
  lines: [],
  isLoading: false,
  error: null,
  history: [],
  historyIndex: -1,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_LINE':
      return {
        ...state,
        lines: [...state.lines, action.payload],
        isLoading: false,
      };
    case 'UPDATE_LAST_LINE':
      return {
        ...state,
        lines: state.lines.map((line, i) =>
          i === state.lines.length - 1 ? { ...line, content: line.content + action.payload } : line
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR':
      return { ...initialState, lines: state.lines.slice(-2) };
    case 'SET_HISTORY':
      return { ...state, history: action.payload, historyIndex: action.payload.length };
    case 'SET_HISTORY_INDEX':
      return { ...state, historyIndex: action.payload };
    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  getHistory: (direction: 'up' | 'down', currentInput: string) => string;
  addToHistory: (command: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const systemPrompt = `You are OpenCode, an open-source AI coding agent assistant. You help users with:

1. Coding questions and code examples
2. Explaining programming concepts
3. Debugging help
4. Information about OpenCode (the project)
5. General technical questions

Guidelines:
- Be helpful, concise, and technical
- Use terminal-style formatting when appropriate
- Format code blocks with proper syntax highlighting hints
- If you need current information, say "Let me search the web for that"
- Keep responses focused and actionable
- Use emojis sparingly, prefer plain text
- Always answer in character as OpenCode`;

function buildMessages(lines: TerminalLine[]): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt }];
  
  const conversation = lines.filter(l => l.type === 'input' || l.type === 'output');
  
  for (const line of conversation) {
    if (line.type === 'input') {
      messages.push({ role: 'user', content: line.content });
    } else if (line.type === 'output') {
      messages.push({ role: 'assistant', content: line.content });
    }
  }
  
  return messages;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const historyRef = useRef<string[]>([]);
  const streamAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (state.lines.length > 0) {
      historyRef.current = state.lines
        .filter(l => l.type === 'input')
        .map(l => l.content);
      dispatch({ type: 'SET_HISTORY', payload: historyRef.current });
    }
  }, [state.lines.length]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    const userLine: TerminalLine = {
      id: generateId(),
      type: 'input',
      content: message.trim(),
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_LINE', payload: userLine });
    dispatch({ type: 'SET_LOADING', payload: true });

    streamAbortRef.current = new AbortController();

    try {
      const messages = buildMessages(state.lines);
      messages.push({ role: 'user', content: message.trim() });

      let response = '';
      let searchResults = null;

      if (shouldSearchWeb(message)) {
        dispatch({ type: 'ADD_LINE', payload: {
          id: generateId(),
          type: 'search',
          content: `Searching web for: "${message}"...`,
          timestamp: Date.now(),
        }});

        searchResults = await searchWeb(message);
        
        dispatch({ type: 'UPDATE_LAST_LINE', payload: `Search complete. Found ${searchResults.length} results.\n\n` });

        if (searchResults.length > 0) {
          const searchContext = searchResults.map((r, i) => 
            `[${i + 1}] ${r.title}\n${r.url}\n${r.content.slice(0, 200)}...`
          ).join('\n\n');
          
          messages.push({ 
            role: 'user', 
            content: `Based on this search result:\n\n${searchContext}\n\nPlease answer the original question.` 
          });
        }
      }

      const assistantLine: TerminalLine = {
        id: generateId(),
        type: 'output',
        content: '',
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_LINE', payload: assistantLine });

      const generator = streamCompletion(messages, {
        temperature: 0.6,
        maxTokens: 4096,
      });

      for await (const chunk of generator) {
        if (streamAbortRef.current?.signal.aborted) break;
        response += chunk;
        dispatch({ type: 'UPDATE_LAST_LINE', payload: chunk });
      }

      if (searchResults && searchResults.length > 0) {
        const linksLine: TerminalLine = {
          id: generateId(),
          type: 'system',
          content: `\nSources:\n${searchResults.map((r, i) => `${i + 1}. ${r.url}`).join('\n')}`,
          timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_LINE', payload: linksLine });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'ADD_LINE', payload: {
        id: generateId(),
        type: 'error',
        content: `Error: ${errorMessage}`,
        timestamp: Date.now(),
      }});
    } finally {
      streamAbortRef.current = null;
    }
  }, [state.lines, state.isLoading]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const addToHistory = useCallback((command: string) => {
    if (command && command !== historyRef.current[historyRef.current.length - 1]) {
      historyRef.current.push(command);
      dispatch({ type: 'SET_HISTORY', payload: historyRef.current });
      dispatch({ type: 'SET_HISTORY_INDEX', payload: historyRef.current.length });
    }
  }, []);

  const getHistory = useCallback((direction: 'up' | 'down', currentInput: string): string => {
    if (historyRef.current.length === 0) return currentInput;

    let newIndex = state.historyIndex;
    if (direction === 'up' && newIndex > 0) {
      newIndex -= 1;
    } else if (direction === 'down' && newIndex < historyRef.current.length) {
      newIndex += 1;
    }

    dispatch({ type: 'SET_HISTORY_INDEX', payload: newIndex });

    if (newIndex >= historyRef.current.length) {
      return currentInput;
    }
    return historyRef.current[newIndex];
  }, [state.historyIndex]);

  return (
    <ChatContext.Provider value={{
      state,
      sendMessage,
      clearChat,
      getHistory,
      addToHistory,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
