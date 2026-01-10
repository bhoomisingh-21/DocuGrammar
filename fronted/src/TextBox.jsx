const TextBox = ({ children, large }) => (
  <div className={`bg-[#020617] rounded-2xl p-6 text-gray-300 leading-relaxed shadow-inner 
    ${large ? "text-lg" : "text-base"}`}>
    {children || "—"}
  </div>
);

export default TextBox;
