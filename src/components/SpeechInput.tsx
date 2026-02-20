import { Mic, MicOff, Volume2, Trash2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';

interface SpeechInputProps {
  onTranscriptChange: (text: string) => void;
}

const SpeechInput = ({ onTranscriptChange }: SpeechInputProps) => {
  const { transcript, isListening, isSupported, error, startListening, stopListening, clearTranscript } = useSpeechRecognition();
  const { speak, isSupported: ttsSupported } = useTextToSpeech();

  const handleStart = () => {
    clearTranscript();
    startListening();
  };

  const handleStop = () => {
    stopListening();
    if (transcript) onTranscriptChange(transcript);
  };

  if (!isSupported) {
    return (
      <div className="glass-panel p-6 text-center">
        <div className="text-destructive font-medium text-lg mb-2">
          ⚠️ Speech Recognition Not Supported
        </div>
        <p className="text-muted-foreground">
          Please use Google Chrome for speech recognition features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mic Status */}
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          <div className={`w-4 h-4 rounded-full transition-colors ${isListening ? 'bg-success pulse-dot' : 'bg-muted-foreground/30'}`} />
        </div>
        <span className={`text-sm font-medium tracking-wide ${isListening ? 'text-success' : 'text-muted-foreground'}`}>
          {isListening ? 'Listening...' : 'Microphone Ready'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {!isListening ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg 
                       hover:opacity-90 transition-all active:scale-95 glow-border"
          >
            <Mic className="w-5 h-5" />
            Start Listening
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-xl font-semibold text-lg 
                       hover:opacity-90 transition-all active:scale-95 animate-pulse"
          >
            <MicOff className="w-5 h-5" />
            Stop Listening
          </button>
        )}

        {transcript && (
          <>
            <button
              onClick={clearTranscript}
              className="flex items-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium
                         hover:opacity-80 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            {ttsSupported && (
              <button
                onClick={() => speak(transcript)}
                className="flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium
                           hover:opacity-80 transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                Read Aloud
              </button>
            )}
          </>
        )}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="glass-panel p-4 animate-fade-in">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">Live Transcript</div>
          <p className="text-lg leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-destructive text-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeechInput;
