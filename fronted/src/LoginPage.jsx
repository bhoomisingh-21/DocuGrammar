import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'; 
import { useAuth } from './context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/upload'); 
    }, 1500);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const googleUser = res.data;

        const backendRes = await axios.post("http://localhost:5000/api/auth/google", {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.sub,
          avatar: googleUser.picture,
        });

        if (backendRes.data.success) {
          login(backendRes.data.user);
          navigate("/upload"); 
        }
      } catch (err) {
        console.error("Google Auth Failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- MAIN LOGIN CONTAINER --- */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-[#0b1120]/80 border border-slate-800/60 rounded-4xl md:rounded-4xl overflow-hidden shadow-2xl backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
        
        {/* LEFT SIDE: Centered Branding (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-linear-to-br from-blue-600/10 to-transparent border-r border-slate-800/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] mask-[radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
            <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]"></div>
          </div>

          <div className="relative z-10 text-center animate-[scaleIn_0.6s_ease-out]">
            <div className="inline-flex p-4 rounded-3xl bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-8">
              <Sparkles size={48} className="text-white fill-current" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white mb-4">
              Docu<span className="text-blue-500">Grammar</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-[280px] mx-auto leading-relaxed">
              Elevate your writing with precision AI.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="p-6 sm:p-10 md:p-16 flex flex-col justify-center relative">
          {/* Back Button - Centered on Mobile */}
          <div className="absolute top-6 left-0 right-0 lg:left-8 lg:right-auto flex justify-center lg:justify-start">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs sm:text-sm font-medium group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to site
            </button>
          </div>

          <div className="max-w-sm mx-auto w-full pt-8 lg:pt-0">
            {/* Mobile Logo */}
            <div className="mb-8 lg:hidden text-center">
               <h1 className="text-3xl font-bold text-white tracking-tight">Docu<span className="text-blue-500">Grammar</span></h1>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm sm:text-base">Log in to your workspace to continue.</p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="you@example.com"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] sm:text-xs text-blue-500 hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 sm:py-4 pl-12 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-600 text-sm sm:text-base"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">
                <span className="bg-[#0b1120] px-4">Or continue with</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500 bg-transparent rounded-2xl py-3 sm:py-3.5 transition-all font-semibold text-xs sm:text-sm group"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" alt="Google" />
              Google
            </button>

            <p className="text-center text-slate-500 text-xs sm:text-sm mt-8 sm:mt-10">
              Don't have an account? 
              <button onClick={() => navigate("/register")} className="text-blue-500 font-bold hover:text-blue-400 ml-1 transition-colors">Sign up</button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;