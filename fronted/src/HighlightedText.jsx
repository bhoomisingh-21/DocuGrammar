import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

const TooltipContent = ({ issue, anchorRect }) => {
  const isAI = issue.id?.toString().startsWith('ai-');
  const tooltipWidth = 280; 
  let leftPos = anchorRect.left + anchorRect.width / 2;
  
  // Viewport protection logic
  const minMargin = 15;
  if (leftPos - tooltipWidth / 2 < minMargin) {
    leftPos = tooltipWidth / 2 + minMargin;
  } else if (leftPos + tooltipWidth / 2 > window.innerWidth - minMargin) {
    leftPos = window.innerWidth - tooltipWidth / 2 - minMargin;
  }

  return (
    <div 
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: anchorRect.top + window.scrollY - 12,
        left: leftPos,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className={`pointer-events-auto w-[280px] p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
        isAI ? "bg-blue-600 text-white" : issue.type === "grammar" ? "bg-red-600 text-white" : "bg-yellow-500 text-black"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">
            {isAI ? "AI Suggestion" : `${issue.type} issue`}
          </span>
        </div>
        <div className="text-[12px] md:text-[13px] leading-snug font-medium mb-2">
          {issue.reason || issue.message}
        </div>
        {issue.replacement && (
          <div className="mt-2 p-2 rounded-lg text-[11px] font-bold bg-black/20 text-white">
            Suggested: {issue.replacement}
          </div>
        )}
        
        {/* Arrow - points exactly to the center of the word */}
        <div 
          className={`absolute top-full border-8 border-transparent ${
            isAI ? "border-t-blue-600" : issue.type === "grammar" ? "border-t-red-600" : "border-t-yellow-500"
          }`}
          style={{
            left: `calc(50% + ${anchorRect.left + anchorRect.width/2 - leftPos}px)`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
    </div>
  );
};

const HighlightedText = ({ text, issues }) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const containerRef = useRef(null);

  // Close when clicking outside (important for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveIssueIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!text || !issues.length) return text || "—";

  const elements = [];
  let lastIndex = 0;
  const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

  sortedIssues.forEach((issue, i) => {
    const { start, end, type, id } = issue;
    const isAI = id?.toString().startsWith('ai-');
    const isActive = activeIssueIndex === i;

    if (start > lastIndex) {
      elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
    }

    elements.push(
      <span
        key={`issue-${i}`}
        onMouseEnter={(e) => {
          // Hover behavior for desktop
          setAnchorRect(e.currentTarget.getBoundingClientRect());
          setActiveIssueIndex(i);
        }}
        onMouseLeave={() => {
          // Only close on mouse leave if we want it purely hover-based
          setActiveIssueIndex(null);
        }}
        onClick={(e) => {
          // Click behavior for mobile/touch
          setAnchorRect(e.currentTarget.getBoundingClientRect());
          setActiveIssueIndex(isActive ? null : i);
        }}
        className={`inline-block cursor-pointer border-b-2 leading-loose transition-all select-none ${
          isAI ? "border-blue-500/60 bg-blue-500/5 hover:bg-blue-500/10"
          : type === "grammar" ? "border-red-500/60 bg-red-500/5 hover:bg-red-500/10"
          : "border-yellow-400/60 bg-yellow-400/5 hover:bg-yellow-400/10"
        }`}
      >
        {text.slice(start, end)}
      </span>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) elements.push(<span key="rest">{text.slice(lastIndex)}</span>);

  return (
    <div ref={containerRef} className="inline relative">
      {elements}
      {activeIssueIndex !== null && anchorRect && createPortal(
        <TooltipContent 
          issue={sortedIssues[activeIssueIndex]} 
          anchorRect={anchorRect} 
        />,
        document.body
      )}
    </div>
  );
};

export default HighlightedText;