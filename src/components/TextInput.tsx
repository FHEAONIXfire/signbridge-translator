import { useState } from 'react';
import { Type, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

const TextInput = ({ onTextSubmit }: TextInputProps) => {
  const [text, setText] = useState('');
  const { speak, isSupported: ttsSupported } = useTextToSpeech();

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your sentence here..."
          className="w-full min-h-[120px] p-4 bg-surface border border-border rounded-xl text-lg text-foreground 
                     placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 
                     focus:ring-primary/50 focus:border-primary/50 transition-all font-sans"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg 
                     hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed glow-border"
        >
          <Type className="w-5 h-5" />
          Convert to Sign Format
        </button>

        {text.trim() && ttsSupported && (
          <button
            onClick={() => speak(text)}
            className="flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium
                       hover:opacity-80 transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            Read Aloud
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
