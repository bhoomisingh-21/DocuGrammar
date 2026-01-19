const Card = ({ title, icon, children, actions }) => (
  <div className="relative p-px rounded-[13px] md:rounded-[25px] bg-blue-500/10 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
    {/* REMOVED overflow-hidden HERE */}
    <div className="rounded-xl md:rounded-3xl bg-[#0a101f] border border-blue-500/10 flex flex-col">
      
      {/* ADDED rounded-t to match the parent's inner radius */}
      <div className="bg-blue-500/2 px-4 md:px-8 py-3 md:py-5 border-b border-white/5 flex items-center justify-between rounded-t-xl md:rounded-t-3xl">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-blue-400 opacity-90 scale-75 md:scale-100">
            {icon}
          </div>
          <h3 className="text-sm md:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            {title}
          </h3>
        </div>
        <div className="shrink-0">{actions}</div>
      </div>
      
      <div className="p-3 md:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default Card;