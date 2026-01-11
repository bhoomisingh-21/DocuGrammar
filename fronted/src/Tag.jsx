const Tag = ({ children, color }) => {
  const styles = {
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400"
  };

  const selectedStyle = styles[color] || styles.yellow;

  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${selectedStyle}`}>
      {children}
    </span>
  );
};

export default Tag;
