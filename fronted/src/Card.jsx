const Card = ({ title, icon, children, actions }) => (
  /* Outer wrapper: Blue-tinted border-glow effect */
  <div className="relative p-[1px] rounded-[13px] md:rounded-[25px] bg-blue-500/10 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
    
    {/* Inner Card: The dark body */}
    <div className="rounded-xl md:rounded-3xl bg-[#0a101f] border border-blue-500/10 flex flex-col overflow-hidden">
      
      {/* Header: Subtle blue wash */}
      <div className="bg-blue-500/[0.02] px-4 md:px-8 py-3 md:py-5 border-b border-white/5 flex items-center justify-between">
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
      
      {/* Content */}
      <div className="p-3 md:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default Card;