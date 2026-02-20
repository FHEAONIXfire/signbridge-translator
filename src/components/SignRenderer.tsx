import { useState, useEffect } from 'react';
import { KNOWN_SIGNS, SIGN_VISUALS } from '@/lib/asl-converter';
import { Minus, Plus } from 'lucide-react';

interface SignRendererProps {
  signText: string;
}

const SignRenderer = ({ signText }: SignRendererProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1500);
  const [isPlaying, setIsPlaying] = useState(true);

  const words = signText.split(' ').filter(Boolean);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [signText]);

  useEffect(() => {
    if (!isPlaying || words.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, words.length, speed]);

  if (!signText) return null;

  const currentWord = words[currentIndex];
  const isKnown = KNOWN_SIGNS.has(currentWord);
  const visual = SIGN_VISUALS[currentWord];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
          Sign Animation
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <button
            onClick={() => setSpeed(s => Math.min(3000, s + 250))}
            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-mono w-12 text-center">{(speed / 1000).toFixed(1)}s</span>
          <button
            onClick={() => setSpeed(s => Math.max(500, s - 250))}
            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Sign Display */}
      <div className="relative min-h-[200px] flex items-center justify-center glass-panel glow-border overflow-hidden">
        <div key={`${currentWord}-${currentIndex}`} className="text-center animate-sign-pop p-8">
          {isKnown && visual ? (
            <>
              <div className="text-7xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
                {visual.emoji}
              </div>
              <div className="text-3xl font-bold tracking-wide mb-2">{currentWord}</div>
              <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                {visual.description}
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 opacity-40">🤚</div>
              <div className="text-3xl font-bold tracking-wide mb-2">{currentWord}</div>
              <div className="text-xs text-warning font-medium uppercase tracking-wider">
                Sign not available — showing text
              </div>
            </>
          )}
        </div>
      </div>

      {/* Word Timeline */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {words.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => { setCurrentIndex(i); setIsPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              i === currentIndex
                ? 'bg-primary text-primary-foreground scale-110'
                : i < currentIndex
                ? 'bg-secondary/80 text-secondary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Replay */}
      {!isPlaying && currentIndex >= words.length - 1 && (
        <div className="text-center">
          <button
            onClick={() => { setCurrentIndex(0); setIsPlaying(true); }}
            className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
          >
            ↻ Replay
          </button>
        </div>
      )}
    </div>
  );
};

export default SignRenderer;
