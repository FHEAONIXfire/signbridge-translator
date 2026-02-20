import { Clock, Trash2, Copy } from 'lucide-react';

interface HistoryEntry {
  id: string;
  original: string;
  converted: string;
  timestamp: number;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const HistoryPanel = ({ entries, onClear, onSelect }: HistoryPanelProps) => {
  if (entries.length === 0) return null;

  return (
    <div className="glass-panel p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-medium">
          <Clock className="w-4 h-4" />
          Recent Translations
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {entries.map(entry => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full text-left p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-all group"
          >
            <div className="text-sm text-muted-foreground truncate">{entry.original}</div>
            <div className="text-sm font-semibold font-mono text-primary truncate">{entry.converted}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export type { HistoryEntry };
export default HistoryPanel;
