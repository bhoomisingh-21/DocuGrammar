import React from "react";
import { Copy, Download } from "lucide-react";

/* ================= CARD ================= */
export const Card = ({ title, icon, children }) => (
  <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="flex gap-3">
        <IconBtn><Copy /></IconBtn>
        <IconBtn><Download /></IconBtn>
      </div>
    </div>
    {children}
  </div>
);

/* ================= TEXT BOX ================= */
export const TextBox = ({ children, large }) => (
  <div
    className={`bg-[#020617] rounded-2xl p-6 text-gray-300 leading-relaxed
      ${large ? "text-lg" : "text-base"}`}
  >
    {children || "—"}
  </div>
);

/* ================= ICON BUTTON ================= */
export const IconBtn = ({ children }) => (
  <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
    {React.cloneElement(children, {
      className: "w-5 h-5 text-blue-300",
    })}
  </button>
);

/* ================= TAG ================= */
export const Tag = ({ children, color }) => {
  const map = {
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[color]}`}>
      {children}
    </span>
  );
};

/* ================= ROW ================= */
export const Row = ({ label, value }) => (
  <div className="flex justify-between text-gray-300">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

