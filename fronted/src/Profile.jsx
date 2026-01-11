import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./NavBar";
import {
  Clock,
  FileText,
  ChevronRight,
  Mail,
  ArrowLeft,
  Shield,
  Trash2,
  BarChart3,
  Sparkles
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = user?.uid || "test_user_id";
        const response = await fetch(`https://docugrammar-backend.onrender.com/api/user-history/${userId}`);
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleViewAnalysis = (item) => {
    navigate("/result", { state: item });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this analysis?")) return;
    try {
      await fetch(`https://docugrammar-backend.onrender.com/api/delete-analysis/${id}`, { method: "DELETE" });
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">

        {/* CENTERED BUTTON */}
        <div className="mb-12 flex justify-center">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Analyze New Document</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-linear-to-br from-[#0d121f] to-[#050916] border border-white/10 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">{user?.name || "User Name"}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} className="text-blue-400" /> {user?.email || "No Email Found"}
              </span>
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield size={14} className="text-emerald-400" /> Free Plan
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-xl font-bold">Recent History</h2>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-gray-500 animate-pulse">Loading your history...</div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleViewAnalysis(item)}
                    className="group bg-[#0d121f] border border-white/5 hover:border-blue-500/30 p-5 rounded-2xl flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-200 truncate max-w-[150px] sm:max-w-xs">{item.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <button
                        onClick={(e) => handleDelete(e, item._id)}
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl px-4">
                  <p className="text-gray-500">No documents analyzed yet.</p>
                  <button onClick={() => navigate("/")} className="mt-4 text-blue-400 hover:underline">Start writing now</button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section: Grid for mobile side-by-side, space-y for desktop */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-blue-400" size={20} />
              <h2 className="text-xl font-bold">Writing Stats</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-6">
              <div className="bg-[#0d121f] border border-white/5 p-6 rounded-3xl flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-gray-500" />
                  <p className="text-gray-500 text-[10px] sm:text-sm uppercase tracking-wider font-bold">Files</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{history.length}</p>
              </div>

              <div className="bg-[#0d121f] border border-white/5 p-6 rounded-3xl flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-blue-400" />
                  <p className="text-gray-500 text-[10px] sm:text-sm uppercase tracking-wider font-bold">Fixes</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {history.reduce((acc, curr) => acc + (curr.issues?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}