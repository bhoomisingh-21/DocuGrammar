import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Menu, X } from "lucide-react";

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
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(0,122,255,0.4)] flex items-center justify-center">
            <span className="text-white text-xl">✦</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-100">
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
              {!shrink && (
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  onClick={() => navigate("/profile")}
                >
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-8 h-8 rounded-full border border-blue-500/50"
                    />
                  )}
                  <span className="text-gray-200 text-sm font-medium">
                    {user.name}
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-400 hover:text-red-300 text-[14px] font-bold uppercase tracking-widest transition-all"
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden absolute right-6  top-1/2 -translate-y-1/2 text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 mx-4 rounded-2xl bg-[#0b0f19]/90 border border-white/10 backdrop-blur-xl p-6 space-y-6">
          <ul className="flex flex-col gap-4 text-gray-300 text-[15px]">
            <li onClick={() => { onFeaturesClick(); setIsOpen(false); }} className="cursor-pointer">Features</li>
            <li onClick={() => { onDemoClick(); setIsOpen(false); }} className="cursor-pointer">Demo</li>
            <li onClick={() => { onTestimonialsClick(); setIsOpen(false); }} className="cursor-pointer">Testimonials</li>
            <li onClick={() => { onPricingClick(); setIsOpen(false); }} className="cursor-pointer">Pricing</li>
          </ul>

          <div className="border-t border-white/10 pt-4">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setIsOpen(false);
                }}
                className="w-full text-red-400 font-semibold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold"
              >
                Get Started →
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
