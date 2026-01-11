import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Menu, X, User, LogOut, ChevronRight } from "lucide-react";

export default function Navbar({
  onFeaturesClick,
  onDemoClick,
  onPricingClick,
  onTestimonialsClick,
}) {
  const [shrink, setShrink] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) setShrink(true);
      else setShrink(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${shrink ? "py-2 backdrop-blur-xl" : "py-6"}
      `}
    >
      {/* INNER CONTAINER */}
      <div
        className={`relative flex items-center justify-between transition-all duration-500 mx-auto
          ${shrink
            ? "max-w-[900px] px-6 md:px-10 py-4 rounded-2xl bg-[#0b0f19]/70 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            : "max-w-[1400px] px-6 md:px-16"}
        `}
      >
     {/* Logo */}
<div
  className="flex items-center gap-2 md:gap-3 cursor-pointer select-none"
  onClick={handleLogoClick}
>
  {/* Shrank the icon box slightly from w-9 to w-8 */}
  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-linear-to-br from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(0,122,255,0.4)] flex items-center justify-center shrink-0">
    <span className="text-white text-lg md:text-xl">✦</span>
  </div>
  
  {/* Shrank the text size for mobile (text-lg) vs desktop (text-xl) */}
  <h1 className="text-lg md:text-xl font-semibold text-gray-100 tracking-tight">
    Docu<span className="text-white font-bold">Grammar</span>
  </h1>
</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-12 text-gray-400 font-medium text-[15px]">
          <li onClick={onFeaturesClick} className="hover:text-gray-200 cursor-pointer transition">Features</li>
          <li onClick={onDemoClick} className="hover:text-gray-200 cursor-pointer transition">Demo</li>
          <li onClick={onTestimonialsClick} className="hover:text-gray-200 cursor-pointer transition">Testimonials</li>
          <li onClick={onPricingClick} className="hover:text-gray-200 cursor-pointer transition">Pricing</li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group"
                onClick={() => navigate("/profile")}
              >
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-8 h-8 rounded-full border border-blue-500/50 group-hover:border-blue-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </div>
                <span className="text-gray-200 text-sm font-medium">
                  {user.name}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-400 hover:text-red-300 text-[12px] font-black uppercase tracking-widest transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 text-[15px] rounded-full font-semibold text-white
              bg-[#0b0f19] border border-[#3d3f53]
              hover:border-blue-600 hover:shadow-[0_0_15px_rgba(50,80,255,0.4)]
              transition-all"
            >
              Get Started →
            </button>
          )}
        </div>

        {/* Mobile Action Area (Avatar + Hamburger) */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/50 active:scale-90 transition-transform"
            >
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>
          )}
          <button
            className="text-gray-200 p-1 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl bg-[#0b0f19]/95 border border-white/10 backdrop-blur-2xl p-6 shadow-2xl space-y-6">
            
            {/* User Profile Card - Mobile */}
            {user && (
              <div 
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer active:bg-white/10 transition-colors"
                onClick={() => { navigate("/profile"); setIsOpen(false); }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-12 h-12 rounded-full border-2 border-blue-500/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base">{user.name}</span>
                    <span className="text-blue-400 text-xs font-medium">Account Settings</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-500" size={20} />
              </div>
            )}

            <ul className="flex flex-col gap-5 text-gray-300 text-base font-medium">
              <li onClick={() => { onFeaturesClick(); setIsOpen(false); }} className="flex items-center justify-between hover:text-white">
                Features <ChevronRight size={16} className="opacity-30" />
              </li>
              <li onClick={() => { onDemoClick(); setIsOpen(false); }} className="flex items-center justify-between hover:text-white">
                Demo <ChevronRight size={16} className="opacity-30" />
              </li>
              <li onClick={() => { onTestimonialsClick(); setIsOpen(false); }} className="flex items-center justify-between hover:text-white">
                Testimonials <ChevronRight size={16} className="opacity-30" />
              </li>
              <li onClick={() => { onPricingClick(); setIsOpen(false); }} className="flex items-center justify-between hover:text-white">
                Pricing <ChevronRight size={16} className="opacity-30" />
              </li>
            </ul>

            <div className="border-t border-white/10 pt-6">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsOpen(false);
                  }}
                  className="w-full py-4 flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-[0.2em] text-xs bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  Get Started →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}