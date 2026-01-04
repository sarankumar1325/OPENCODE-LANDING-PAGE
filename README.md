# OpenCode - AI Coding Agent Landing Page

An interactive terminal-style landing page for OpenCode, featuring a real-time AI chatbot powered by Groq and Tavily.

## Features

- **Interactive Terminal Chat** - Ask questions about OpenCode and get AI-powered responses
- **Real-time Streaming** - Responses stream character-by-character like a real terminal
- **Web Search** - Automatic web search for current information via Tavily
- **Command History** - Use arrow keys to navigate previous commands
- **Boot Sequence Animation** - Terminal-style startup sequence
- **Terminal Styling** - Dark theme with green accents, CRT overlay effects

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling (via CDN)
- **Groq API** - LLM inference (Kimi-K2 model)
- **Tavily API** - Web search

## Getting Started

### Prerequisites

- Node.js or Bun runtime
- Groq API key
- Tavily API key

### Installation

```bash
# Install dependencies
bun install

# or with npm
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_TAVILY_API_KEY=your_tavily_api_key
```

Get your API keys:
- **Groq**: https://console.groq.com
- **Tavily**: https://tavily.com

### Development

```bash
# Start development server
bun run dev

# or with npm
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Production build
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
opencode/
├── src/
│   ├── context/
│   │   └── ChatContext.tsx    # Chat state management
│   ├── services/
│   │   ├── groq.ts            # Groq API integration
│   │   └── tavily.ts          # Tavily web search
│   ├── types.ts               # TypeScript interfaces
│   └── vite-env.d.ts          # Vite type declarations
├── components/
│   ├── InteractiveTerminal.tsx # Main chat terminal
│   ├── BootSequence.tsx       # Startup animation
│   ├── NavBar.tsx             # Navigation header
│   ├── Stats.tsx              # Stats visualization
│   └── ui/
│       ├── Box.tsx            # Styled container
│       └── TerminalText.tsx   # Typewriter effect
├── public/
│   ├── opencode-wordmark.svg  # Brand wordmark
│   └── favicon.svg            # Site favicon
├── App.tsx                    # Main application
├── index.tsx                  # Entry point
├── vite.config.ts             # Vite configuration
└── package.json
```

## Usage

1. The page starts with a boot sequence animation
2. Click or press Enter to open the interactive terminal
3. Type your question about OpenCode and press Enter
4. The AI will respond in real-time
5. Use ↑/↓ arrows to navigate command history
6. Press Ctrl+L to clear the chat

### Example Questions

- "What is OpenCode?"
- "How do I install OpenCode?"
- "What are the latest features?"
- "Tell me about the project"

## API Integration

### Groq (LLM)

- **Model**: moonshotai/kimi-k2-instruct
- **Temperature**: 0.6
- **Max Tokens**: 4096
- Streaming responses enabled

### Tavily (Web Search)

- Automatic triggering for current queries (latest, recent, news, etc.)
- Returns up to 5 search results
- Sources cited in responses

## Customization

### Colors

Edit the Tailwind config in `index.html` to customize colors:

```javascript
colors: {
  terminal: {
    black: '#09090b',
    green: '#22c55e',
    // ...
  }
}
```

### System Prompt

Modify the system prompt in `src/context/ChatContext.tsx` to customize AI behavior.

## License

MIT License
