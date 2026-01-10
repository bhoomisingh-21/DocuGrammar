/* ================= HIGHLIGHTED TEXT ================= */

export const HighlightedText = ({ text, issues }) => {
  if (!text) return "—";
  if (!issues.length) return text;

  const elements = [];
  let lastIndex = 0;

  const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

  sortedIssues.forEach((issue, i) => {
    const { start, end, type, message, replacement } = issue;

    if (start > lastIndex) {
      elements.push(
        <span key={`text-${i}`}>
          {text.slice(lastIndex, start)}
        </span>
      );
    }

    elements.push(
      <span
        key={`issue-${i}`}
        className={`group relative cursor-help underline decoration-2 ${
          type === "grammar"
            ? "decoration-red-500"
            : "decoration-yellow-400"
        }`}
      >
        {text.slice(start, end)}

        <span
          className={`absolute z-50 pointer-events-none
            left-1/2 -translate-x-1/2 bottom-full mb-2
            min-w-[320px] max-w-[520px]
            px-4 py-3 rounded-xl
            text-[13px] leading-snug
            shadow-xl
            opacity-0 translate-y-1 scale-95
            group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
            transition-all duration-150 ease-out
            ${
              type === "grammar"
                ? "bg-red-500 text-yellow-100"
                : "bg-yellow-400 text-black"
            }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold uppercase tracking-wide text-[11px]">
              {type}
            </span>

            {replacement && (
              <span className="ml-auto font-bold underline">
                Fix: {replacement}
              </span>
            )}
          </div>

          <div className="text-[12.5px]">
            {message}
          </div>
        </span>
      </span>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    elements.push(
      <span key="rest">{text.slice(lastIndex)}</span>
    );
  }

  return <>{elements}</>;
};

/* ================= INSIGHT LIST ================= */

export const InsightList = ({ data, tone }) =>
  data.length ? (
    <ul className="space-y-4">
      {data.map((item, i) => (
        <li
          key={i}
          className={`relative p-4 rounded-xl border backdrop-blur-md
            ${
              tone === "style"
                ? "bg-yellow-500/5 border-yellow-500/20"
                : "bg-purple-500/5 border-purple-500/20"
            }`}
        >
          <span
            className={`absolute -left-3 top-4 w-6 h-6 flex items-center justify-center
              rounded-full text-xs font-semibold
              ${
                tone === "style"
                  ? "bg-yellow-400 text-black"
                  : "bg-purple-400 text-black"
              }`}
          >
            {i + 1}
          </span>

          <p className="text-sm text-gray-300 leading-relaxed">
            {item}
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 text-sm">
      No suggestions available.
    </p>
  );

  