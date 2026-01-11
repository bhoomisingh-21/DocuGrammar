const TextBox = ({ children, large, innerRef }) => (
  <div
    ref={innerRef}
    className={`bg-[#020617] rounded-lg md:rounded-2xl p-3 md:p-6 text-gray-300 transition-all 
      ${large ? "text-[15px] md:text-lg leading-snug md:leading-relaxed" : "text-xs md:text-base leading-normal"} 
      selection:bg-blue-500/30 selection:text-blue-100 border border-white/5`}
  >
    {children || "—"}
  </div>
);

export default TextBox;
