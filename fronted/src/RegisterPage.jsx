import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
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
        
        const backendRes = await axios.post("http://localhost:5000/api/auth/google", {
          name: res.data.name,
          email: res.data.email,
          googleId: res.data.sub,
          avatar: res.data.picture,
        });

        if (backendRes.data.success) {
          navigate("/upload"); 
        }
      } catch (err) {
        console.error("Google Registration Failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- BACKGROUND EFFECTS (Synced with Login) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- MAIN CONTAINER --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-[#0b1120]/80 border border-slate-800/60 rounded-4xl overflow-hidden shadow-2xl backdrop-blur-md"
      >
        
        {/* LEFT SIDE: Branding (Exactly like Login Page) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-linear-to-br from-blue-600/10 to-transparent border-r border-slate-800/50 relative overflow-hidden">
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03] mask-[radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
            <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]"></div>
          </div>

          <div className="relative z-10 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex p-4 rounded-3xl bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-8"
            >
              <Sparkles size={48} className="text-white fill-current" />
            </motion.div>
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
          
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs md:text-sm font-medium group z-20"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to site</span>
          </motion.button>

          <div className="max-w-sm mx-auto w-full pt-8 lg:pt-0">
            {/* Mobile Header Branding */}
            <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
               <h1 className="text-3xl font-bold text-white tracking-tight">Docu<span className="text-blue-500">Grammar</span></h1>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-500 text-sm md:text-base">Join the precision writing revolution.</p>
            </motion.div>

            <form className="space-y-4 md:space-y-5" onSubmit={handleRegister}>
              {[
                { label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text' },
                { label: 'Email Address', icon: Mail, placeholder: 'you@example.com', type: 'email' }
              ].map((field, i) => (
                <motion.div key={i} variants={itemVariants} className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                  <div className="relative group">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      type={field.type} 
                      required
                      placeholder={field.placeholder}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-600 text-sm md:text-base"
                    />
                  </div>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3.5 md:py-4 pl-12 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm md:text-base"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 md:py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-4 overflow-hidden relative text-sm md:text-base"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loader"
                      initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" 
                    />
                  ) : (
                    <motion.div 
                      key="text"
                      initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                      className="flex items-center gap-2"
                    >
                      Sign Up <ArrowRight size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">
                <span className="bg-[#0b1120] px-4">Or continue with</span>
              </div>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500 bg-transparent rounded-2xl py-3 md:py-3.5 transition-all font-semibold text-xs md:text-sm group"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" alt="Google" />
              Google
            </motion.button>

            <motion.p variants={itemVariants} className="text-center text-slate-500 text-xs md:text-sm mt-8 md:mt-10">
              Already have an account? 
              <button 
                onClick={() => navigate('/login')} 
                className="text-blue-500 font-bold hover:text-blue-400 ml-1 transition-colors"
              >
                Log in
              </button>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;