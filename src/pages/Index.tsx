import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Type, Copy, Download, ArrowRight, Sparkles } from 'lucide-react';
import SpeechInput from '@/components/SpeechInput';
import TextInput from '@/components/TextInput';
import SignRenderer from '@/components/SignRenderer';
import HistoryPanel, { type HistoryEntry } from '@/components/HistoryPanel';
import ParticleField from '@/components/ParticleField';
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

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
    <div className="dark min-h-screen bg-background text-foreground overflow-hidden relative">
      <ParticleField />

      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 py-8 space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Hero Header */}
        <motion.header variants={item} className="text-center space-y-4 pt-8 pb-4">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            100% Browser-Based · Zero Cost · Offline Ready
          </motion.div>

          <div className="inline-flex items-center gap-4">
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🤟
            </motion.span>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Sign<span className="text-gradient">Bridge</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Real-time accessibility translator — speech to sign, powered entirely by your browser.
          </p>
        </motion.header>

        {/* Mode Toggle */}
        <motion.div variants={item} className="flex justify-center">
          <div className="inline-flex bg-secondary/60 backdrop-blur-sm rounded-2xl p-1.5 gap-1 border border-border/30">
            {[
              { key: 'speech' as InputMode, icon: Mic, label: 'Speech Input' },
              { key: 'text' as InputMode, icon: Type, label: 'Text Input' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  mode === key
                    ? 'text-primary-foreground shadow-lg'
                    : 'text-secondary-foreground hover:text-foreground'
                }`}
              >
                {mode === key && (
                  <motion.div
                    layoutId="mode-bg"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.section variants={item} className="glass-panel p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'speech' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'speech' ? 20 : -20 }}
              transition={{ duration: 0.25 }}
            >
              {mode === 'speech' ? (
                <SpeechInput onTranscriptChange={handleConvert} />
              ) : (
                <TextInput onTextSubmit={handleConvert} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Conversion Result */}
        <AnimatePresence>
          {convertedText && (
            <motion.section
              className="space-y-4"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-panel p-6 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">Original</div>
                  <p className="text-foreground/80">{originalText}</p>
                </div>

                <div className="flex items-center gap-2 text-primary">
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                  <span className="text-xs uppercase tracking-widest font-medium">ASL Format</span>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-2xl font-bold font-mono tracking-wider text-primary">
                    {convertedText}
                  </p>
                </div>

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

              <div className="glass-panel p-6">
                <SignRenderer signText={convertedText} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History */}
        <motion.div variants={item}>
          <HistoryPanel entries={history} onClear={clearHistory} onSelect={handleHistorySelect} />
        </motion.div>

        {/* Footer */}
        <motion.footer variants={item} className="text-center text-xs text-muted-foreground/50 pb-4">
          SignBridge — 100% browser-based, zero API cost, fully offline capable.
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Index;
