
import { Info } from "lucide-react";


const HighlightedText = ({ text, issues }) => {
  if (!text) return "—";
  if (!issues.length) return text;

  const elements = [];
  let lastIndex = 0;
  const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

  sortedIssues.forEach((issue, i) => {
    const { start, end, type, replacement, reason, message, id } = issue;
    const isAI = id?.toString().startsWith('ai-');

    if (start > lastIndex) {
      elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
    }

    elements.push(
      <span
        key={`issue-${i}`}
        className={`group relative inline-block cursor-help border-b-2 leading-loose transition-all ${isAI ? "border-blue-500/60 hover:bg-blue-500/10"
          : type === "grammar" ? "border-red-500/60 hover:bg-red-500/10"
            : "border-yellow-400/60 hover:bg-yellow-400/10"
          }`}
      >
        {text.slice(start, end)}
        <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 md:w-72 p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none translate-y-2 group-hover:translate-y-0 ${isAI ? "bg-blue-600 text-white" : type === "grammar" ? "bg-red-600 text-white" : "bg-yellow-500 text-black"
          }`}>
          <div className="flex items-center gap-2 mb-2">
<Info className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{isAI ? "AI Suggestion" : `${type} issue`}</span>
          </div>
          <div className="text-[12px] md:text-[13px] leading-snug font-medium mb-2">{reason || message}</div>
          {replacement && <div className="mt-2 p-2 rounded-lg text-[11px] font-bold bg-black/20 text-white">Suggested: {replacement}</div>}
        </span>
      </span>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) elements.push(<span key="rest">{text.slice(lastIndex)}</span>);
  return <>{elements}</>;
};

export default HighlightedText;
