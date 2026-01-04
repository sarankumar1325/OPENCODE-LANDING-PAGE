import React, { useState, useEffect } from 'react';
import {
  Copy,
  Terminal as TerminalIcon,
  Cpu,
  Share2,
  Lock,
  Globe,
  Zap,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { BootSequence } from './components/BootSequence';
import { TerminalText } from './components/ui/TerminalText';
import { Box } from './components/ui/Box';
import { Stats } from './components/Stats';
import { NavBar } from './components/NavBar';
import InteractiveTerminal from './components/InteractiveTerminal';
import { ChatProvider } from './src/context/ChatContext';

// Types and Constants
enum InstallMethod {
  CURL = 'curl',
  NPM = 'npm',
  BUN = 'bun',
  BREW = 'brew',
}

const installCommands = {
  [InstallMethod.CURL]: 'curl -fsSL https://opencode.ai/install | bash',
  [InstallMethod.NPM]: 'npm install -g opencode',
  [InstallMethod.BUN]: 'bun add -g opencode',
  [InstallMethod.BREW]: 'brew install opencode',
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-terminal-border last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-2 hover:bg-terminal-border/30 transition-colors flex items-start gap-3 group"
      >
        <span className="text-terminal-green font-mono">
          {isOpen ? '[-]' : '[+]'}
        </span>
        <span className="font-mono text-sm md:text-base group-hover:text-terminal-green transition-colors">
          {question}
        </span>
      </button>
      {isOpen && (
        <div className="pl-8 pr-4 pb-4 text-terminal-muted text-sm font-mono leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 p-2">
    <div className="text-terminal-green mt-1">{icon}</div>
    <div>
      <h3 className="text-terminal-text font-bold mb-1 uppercase text-sm tracking-wider">{title}</h3>
      <p className="text-terminal-muted text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

// Component to cycle through models with typing effect
const ModelCycler = () => {
  const models = [
    { name: 'MiniMax-M2', provider: 'MiniMax' },
    { name: 'Claude-3.5-Sonnet', provider: 'Anthropic' },
    { name: 'GPT-4o', provider: 'OpenAI' },
    { name: 'Gemini-1.5-Pro', provider: 'Google' }
  ];

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (index >= models.length) {
      setIndex(0);
      return;
    }

    const currentModel = models[index];
    const fullText = `${currentModel.name} ${currentModel.provider}`;

    if (subIndex === fullText.length + 1 && !reverse) {
      // Finished typing, wait before deleting
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      // Finished deleting, move to next model
      setReverse(false);
      setIndex((prev) => (prev + 1) % models.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 60); // Delete faster than typing

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, models]);

  // Blink cursor
  useEffect(() => {
    const timeout = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(timeout);
  }, []);

  const currentModel = models[index];
  const fullText = `${currentModel.name} ${currentModel.provider}`;
  const displayedText = fullText.substring(0, subIndex);
  
  // Split displayed text to style name and provider separately if enough text is shown
  const nameLength = currentModel.name.length;
  const showProvider = displayedText.length > nameLength;
  
  const displayName = showProvider ? currentModel.name : displayedText;
  const displayProvider = showProvider ? displayedText.substring(nameLength + 1) : '';

  return (
    <div className="flex items-center gap-3 text-sm font-mono pl-5 h-6">
      <span className="text-terminal-green">Build</span>
      <span className="text-white font-bold">{displayName}</span>
      {displayProvider && <span className="text-terminal-muted">{displayProvider}</span>}
      <span className={`w-2 h-4 bg-terminal-green ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
    </div>
  );
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [installMethod, setInstallMethod] = useState<InstallMethod>(InstallMethod.CURL);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommands[installMethod]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  return (
    <ChatProvider>
      <div className="min-h-screen bg-terminal-black text-terminal-text font-mono selection:bg-terminal-green selection:text-black">
        <div className="crt-overlay"></div>
        
        <NavBar />

        <main className="pt-16 md:pt-20 pb-12 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 md:space-y-20">
          
          {/* HERO SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 md:pt-10">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 z-10">
            <a href="https://opencode.ai/install" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1 border border-terminal-green/30 bg-terminal-green/5 text-terminal-green text-xs w-fit hover:bg-terminal-green/10 transition-colors">
              <span className="animate-pulse">●</span>
              <span>BETA: DESKTOP APP AVAILABLE</span>
            </a>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight text-white">
              THE <span className="text-terminal-green">OPEN SOURCE</span><br />
              AI CODING AGENT
            </h1>
            
            <p className="text-base md:text-lg text-terminal-muted max-w-xl border-l-2 border-terminal-border pl-4 md:pl-6">
              <TerminalText 
                text="Free models included or connect any model from any provider, including Claude, GPT, Gemini and more."
                speed={20}
                delay={500}
              />
            </p>

            <div className="mt-4 md:mt-8">
              <div className="flex flex-wrap text-xs border-b border-terminal-border w-fit gap-0">
                {Object.values(InstallMethod).map((method) => (
                  <button
                    key={method}
                    onClick={() => setInstallMethod(method)}
                    className={`px-3 md:px-4 py-2 uppercase transition-all ${
                      installMethod === method 
                        ? 'bg-terminal-text text-terminal-black font-bold' 
                        : 'text-terminal-muted hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              
              <div className="relative group mt-0">
                <div className="bg-terminal-dark border border-terminal-border p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <code className="text-terminal-green text-xs md:text-sm break-all flex-1">
                    <span className="text-terminal-muted mr-2 select-none">$</span>
                    <TerminalText 
                      key={installMethod}
                      text={installCommands[installMethod]} 
                      speed={15}
                      delay={100}
                      cursor={true}
                    />
                  </code>
                  <button 
                    onClick={handleCopy}
                    className="text-terminal-muted hover:text-white transition-colors shrink-0 self-end sm:self-auto"
                    title="Copy to clipboard"
                  >
                    {copied ? <span className="text-terminal-green text-xs">COPIED</span> : <Copy size={18} />}
                  </button>
                </div>
                {/* Decorative shadow box */}
                <div className="absolute top-2 left-2 w-full h-full border border-terminal-border -z-10 bg-transparent hidden md:block"></div>
              </div>
            </div>
          </div>

           <div className="lg:col-span-6 flex flex-col justify-center">
            <Box className="p-0 overflow-hidden border-terminal-border">
               <InteractiveTerminal />
            </Box>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="border-y border-terminal-border bg-terminal-dark/30 py-6 md:py-8 px-4 -mx-4 md:-mx-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center">
               <div className="flex flex-col items-center md:items-start md:pl-4">
                  <div className="text-2xl sm:text-3xl font-bold text-white flex items-baseline gap-1">
                    47K <span className="text-terminal-green text-sm">+</span>
                  </div>
                  <div className="text-xs text-terminal-muted uppercase tracking-widest mt-1">GitHub Stars</div>
               </div>
              <div className="flex flex-col items-center md:items-start md:border-l border-terminal-border md:pl-8">
                 <div className="text-2xl sm:text-3xl font-bold text-white">500</div>
                 <div className="text-xs text-terminal-muted uppercase tracking-widest mt-1">Contributors</div>
              </div>
              <div className="flex flex-col items-center md:items-start md:border-l border-terminal-border md:pl-8">
                 <div className="text-2xl sm:text-3xl font-bold text-white">650k</div>
                 <div className="text-xs text-terminal-muted uppercase tracking-widest mt-1">Monthly Devs</div>
              </div>
              <div className="hidden md:block h-12 md:border-l border-terminal-border md:pl-8">
                 <Stats />
              </div>
           </div>
        </section>

        {/* FEATURES GRID */}
        <section>
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
             <div className="h-px bg-terminal-border flex-1"></div>
             <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-widest">[ CAPABILITIES ]</h2>
             <div className="h-px bg-terminal-border flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-terminal-border bg-terminal-border">
             <div className="bg-terminal-black p-4 sm:p-6 border-b sm:border-b-0 border-terminal-border hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<TerminalIcon />}
                  title="LSP Enabled" 
                  desc="Automatically loads the right LSPs for the LLM to understand your codebase structure instantly."
                />
             </div>
             <div className="bg-terminal-black p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-terminal-border hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<Cpu />}
                  title="Multi-Session" 
                  desc="Start multiple agents in parallel on the same project. Threading for your workflow."
                />
             </div>
             <div className="bg-terminal-black p-4 sm:p-6 border-b sm:border-b-0 border-terminal-border hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<Share2 />}
                  title="Share Links" 
                  desc="Generate persistent links to any session for reference, debugging, or team collaboration."
                />
             </div>
             <div className="bg-terminal-black p-4 sm:p-6 border-b md:border-b-0 lg:border-r border-terminal-border hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<Lock />}
                  title="Claude Pro" 
                  desc="Log in with Anthropic to use your Claude Pro or Max account directly within the terminal."
                />
             </div>
             <div className="bg-terminal-black p-4 sm:p-6 border-b md:border-b-0 lg:border-r border-terminal-border hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<Globe />}
                  title="Any Model" 
                  desc="75+ LLM providers via Models.dev. Use local models via Ollama. No lock-in."
                />
             </div>
             <div className="bg-terminal-black p-4 sm:p-6 hover:bg-terminal-border/10 transition-colors">
                <FeatureItem 
                  icon={<Monitor />}
                  title="Any Editor" 
                  desc="Available as a raw terminal interface, a native desktop app, and an IDE extension."
                />
             </div>
          </div>
       </section>

        {/* PRIVACY SECTION */}
        <section className="relative overflow-hidden">
          <Box className="border-l-4 border-l-terminal-green">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div>
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">BUILT FOR PRIVACY FIRST</h2>
                 <p className="text-terminal-muted mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                   OpenCode does not store any of your code or context data. 
                   It operates strictly within your local environment or ephemeral sessions.
                   Designed for privacy-sensitive enterprise environments.
                 </p>
                  <a href="https://opencode.ai/docs/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-terminal-green hover:underline decoration-1 underline-offset-4 text-sm">
                    READ SECURITY AUDIT <ChevronRight size={14} md:size={16} />
                  </a>
              </div>
              <div className="bg-terminal-dark p-4 md:p-6 font-mono text-xs text-terminal-muted border border-terminal-border">
                <div className="flex justify-between mb-2">
                   <span>DATA_RETENTION</span>
                   <span className="text-terminal-green">FALSE</span>
                </div>
                <div className="flex justify-between mb-2">
                   <span>TELEMETRY</span>
                   <span className="text-terminal-green">OPT-IN</span>
                </div>
                <div className="flex justify-between mb-2">
                   <span>CODE_STORAGE</span>
                   <span className="text-terminal-green">NULL</span>
                </div>
                <div className="flex justify-between">
                   <span>ENCRYPTION</span>
                   <span className="text-terminal-green">AES-256</span>
                </div>
              </div>
            </div>
          </Box>
        </section>

        {/* ZEN SECTION */}
        <section className="bg-terminal-border/10 border-y border-terminal-border py-10 md:py-16 -mx-4 md:-mx-8 px-4 md:px-8">
           <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-2 md:p-3 border border-terminal-green rounded-full mb-4 md:mb-6">
                <Zap className="text-terminal-green" size={24} md:size={32} />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">ACCESS RELIABLE OPTIMIZED MODELS</h2>
              <p className="text-terminal-muted max-w-2xl mx-auto mb-6 md:mb-8 text-sm md:text-base">
                Zen gives you access to a handpicked set of AI models that OpenCode has tested and benchmarked specifically for coding agents. Eliminate hallucination.
              </p>
               <a href="https://opencode.ai/zen" target="_blank" rel="noopener noreferrer" className="inline-block bg-terminal-green text-black font-bold px-6 md:px-8 py-2 md:py-3 hover:bg-white transition-colors uppercase tracking-wider cursor-pointer text-sm md:text-base">
                 Learn About Zen
               </a>
           </div>
        </section>

        {/* FAQ SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 relative">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terminal-border opacity-20 absolute -z-10 -ml-2 -mt-2 select-none">FAQ</h2>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 lg:mb-6">FREQUENTLY ASKED</h2>
            <p className="text-terminal-muted text-sm">
              Questions regarding usage, licensing, and model integration.
              <br /><br />
              For technical support, please open an issue on GitHub.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="border-t border-terminal-border">
              <FAQItem 
                question="What is OpenCode?" 
                answer="OpenCode is an open source agent that helps you write and run code with any AI model. It's available as a terminal-based interface, desktop app, or IDE extension."
              />
              <FAQItem 
                question="Do I need extra AI subscriptions?" 
                answer="Not necessarily. OpenCode comes with free models. You can also connect your own API keys for Claude, OpenAI, Gemini, or use local models via Ollama."
              />
              <FAQItem 
                question="Can I use existing subscriptions?" 
                answer="Yes. Supports Claude Pro/Max, ChatGPT Plus/Pro, and GitHub Copilot subscriptions directly."
              />
              <FAQItem 
                question="Is OpenCode open source?" 
                answer="Yes. Fully open source under MIT License. 45k+ stars on GitHub. Community driven."
              />
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="border border-terminal-border p-6 md:p-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 hidden sm:block">
              <TerminalIcon size={100} md:size={200} />
           </div>
           <div className="relative z-10 max-w-xl">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">SUBSCRIBE_TO_UPDATES</h3>
              <p className="text-terminal-muted mb-4 md:mb-6 text-sm">Join the waitlist for early access to new products.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="user@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-terminal-black border border-terminal-border px-4 py-2 w-full text-terminal-text focus:outline-none focus:border-terminal-green placeholder:text-terminal-border"
                />
                <button className="bg-terminal-text text-black px-6 py-2 font-bold hover:bg-terminal-green transition-colors uppercase text-sm">
                  Init
                </button>
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-terminal-border pt-6 md:pt-8 text-xs text-terminal-muted flex flex-col md:flex-row justify-between items-center gap-4 px-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-terminal-green rounded-full"></div>
             <a href="https://opencode.ai/status" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-green transition-colors">SYSTEM: ONLINE</a>
           </div>
           <div className="flex flex-wrap justify-center gap-3 md:gap-6">
             <a href="https://github.com/opencode-ai/opencode" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB [47K]</a>
             <a href="https://opencode.ai/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DOCS</a>
             <a href="https://github.com/opencode-ai/opencode/discussions/131" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DISCORD</a>
             <a href="https://x.com/opencode_ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
           </div>
           <div>
             &copy; 2026 OPENCODE. MIT LICENSE.
           </div>
        </footer>

        </main>
      </div>
    </ChatProvider>
  );
}