
import Info from "./Info";

const ScoreCard = ({ title, score, label, color, subText, children, description }) => (
  <div className="relative rounded-3xl p-6 md:p-8 bg-linear-to-br from-[#020617] via-[#07122b] to-[#020617] border border-white/10 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>

        <div className="group relative">
          <Info className="w-4 h-4 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />

          <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[#1e293b] border border-white/10 text-white text-[11px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
            <div className="font-bold mb-1 border-b border-white/10 pb-1 uppercase tracking-tighter text-blue-400">
              What is this?
            </div>
            {description}
            <div className="absolute top-full right-1 w-2 h-2 bg-[#1e293b] rotate-45 border-r border-b border-white/10 -translate-y-1"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36 md:w-44 md:h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <circle
              cx="60" cy="60" r="54"
              stroke={color} strokeWidth="6" fill="none"
              strokeDasharray={339.29}
              strokeDashoffset={339.29 * (1 - score / 100)}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-black text-white leading-none">{score}</span>
            <span className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-gray-200 mt-2 whitespace-nowrap px-4 text-center">
              {subText}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">{children}</div>
    </div>

    <div className="w-full rounded-xl py-3 px-4 bg-white/5 border border-white/10 text-center text-xs md:text-sm font-black uppercase tracking-widest" style={{ color }}>
      {label}
    </div>
  </div>
);

export default ScoreCard;
