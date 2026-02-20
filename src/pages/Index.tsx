import { useState, useCallback, useEffect } from 'react';
import { Mic, Type, Copy, Download, ArrowRight } from 'lucide-react';
import SpeechInput from '@/components/SpeechInput';
import TextInput from '@/components/TextInput';
import SignRenderer from '@/components/SignRenderer';
import HistoryPanel, { type HistoryEntry } from '@/components/HistoryPanel';
import { convertToASL } from '@/lib/asl-converter';

type InputMode = 'speech' | 'text';

const STORAGE_KEY = 'signbridge-history';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 5)));
}

const Index = () => {
  const [mode, setMode] = useState<InputMode>('text');
  const [originalText, setOriginalText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback((text: string) => {
    setOriginalText(text);
    const result = convertToASL(text);
    setConvertedText(result);

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      original: text,
      converted: result,
      timestamp: Date.now(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 5);
      saveHistory(next);
      return next;
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `SignBridge Translation\n${'='.repeat(30)}\n\nOriginal: ${originalText}\nASL Format: ${convertedText}\n\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signbridge-translation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setOriginalText(entry.original);
    setConvertedText(entry.converted);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="text-5xl">🤟</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Sign<span className="text-gradient">Bridge</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Real-time accessibility translator — speech to sign, powered by your browser.
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="inline-flex bg-secondary rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode('speech')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                mode === 'speech' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Mic className="w-4 h-4" />
              Speech Input
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                mode === 'text' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-secondary-foreground hover:text-foreground'
              }`}
            >
              <Type className="w-4 h-4" />
              Text Input
            </button>
          </div>
        </div>

        {/* Input Section */}
        <section className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {mode === 'speech' ? (
            <SpeechInput onTranscriptChange={handleConvert} />
          ) : (
            <TextInput onTextSubmit={handleConvert} />
          )}
        </section>

        {/* Conversion Result */}
        {convertedText && (
          <section className="space-y-4 animate-fade-in">
            {/* Original → Converted */}
            <div className="glass-panel p-6 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">Original</div>
                <p className="text-foreground/80">{originalText}</p>
              </div>
              
              <div className="flex items-center gap-2 text-primary">
                <ArrowRight className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-medium">ASL Format</span>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-2xl font-bold font-mono tracking-wider text-primary">
                  {convertedText}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium
                             hover:opacity-80 transition-all active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium
                             hover:opacity-80 transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .txt
                </button>
              </div>
            </div>

            {/* Sign Renderer */}
            <div className="glass-panel p-6">
              <SignRenderer signText={convertedText} />
            </div>
          </section>
        )}

        {/* History */}
        <HistoryPanel entries={history} onClear={clearHistory} onSelect={handleHistorySelect} />

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/50 pb-4">
          SignBridge — 100% browser-based, zero API cost, fully offline capable.
        </footer>
      </div>
    </div>
  );
};

export default Index;
