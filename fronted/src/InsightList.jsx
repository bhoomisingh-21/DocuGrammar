

const InsightList = ({ data, type }) => {
  const isStyle = type === "style";
  if (!data.length) return <div className="py-8 text-center text-gray-500 italic border border-white/5 rounded-2xl">Everything looks great.</div>;
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="bg-white/3 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/6">
          <div className="flex items-start gap-4">
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isStyle ? "border-yellow-500/50 text-yellow-500" : "border-purple-500/50 text-purple-400"}`}>
              {i + 1}
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{isStyle ? "Tone & Style" : "Clarity & Flow"}</span>
              <p className="text-[14px] md:text-[15px] text-gray-200 leading-snug">{item}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    
  );
};

export default InsightList;
