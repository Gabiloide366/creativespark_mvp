import { Submission } from "../types";
import { X, Heart, MessageSquare, Share2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface SubmissionDetailModalProps {
  submission: Submission;
  onClose: () => void;
  onLike: (id: string) => void;
}

export default function SubmissionDetailModal({
  submission,
  onClose,
  onLike
}: SubmissionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-h-[90%] bg-[#faf9f8] rounded-t-[32px] border-t border-gray-200 overflow-y-auto no-scrollbar pb-10 flex flex-col z-50 shadow-2xl"
      >
        {/* Top Handle visual bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 flex items-center justify-between pb-3">
          <div>
            <span className="text-[10px] bg-slate-100 text-[#3f6375] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              {submission.isAnonymous ? "🎨 Anonymous Creation" : "🎨 Autorial Artwork"}
            </span>
            <h2 className="text-base font-extrabold text-[#1a1c1c] tracking-tight mt-1">{submission.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 font-bold active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Art Image */}
        <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden ring-1 ring-gray-200 shrink-0">
          <img 
            src={submission.image} 
            alt={submission.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detail Content */}
        <div className="p-5 space-y-5">
          {/* Reaction Bar */}
          <div className="flex items-center justify-between bg-white border border-[#c1c7cc] p-3 rounded-2xl shadow-xs">
            <button 
              onClick={() => onLike(submission.id)}
              className="flex items-center gap-1.5 text-xs text-gray-500 font-extrabold hover:text-[#ba1a1a]"
            >
              <Heart className={`w-5 h-5 ${submission.likes > 2000 ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-gray-400"}`} />
              <span>{submission.likes} Likes</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <span>{submission.comments} Comments</span>
            </div>

            <button 
              onClick={handleShareClick}
              className="flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-[#3f6375]"
            >
              <Share2 className="w-5 h-5 text-gray-400" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          {/* Creation Details / Story */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Story Behind the Artwork</span>
            </h3>
            
            <div className="bg-white border border-[#c1c7cc] p-4 rounded-2xl shadow-xs">
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                {submission.story || "The artist chose to keep the creative details secret, letting the artwork speak directly to the viewer's soul."}
              </p>
            </div>
          </div>

          {/* Profile artist citation */}
          <div className="bg-white border border-gray-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-gray-200 shrink-0">
              <img 
                src={submission.isAnonymous ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" : submission.artistAvatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1a1c1c] leading-none">
                {submission.isAnonymous ? "Anonymous Artist" : submission.artistName}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 font-sans block">
                {submission.isAnonymous ? "Submitted privately to the Gallery" : submission.artistHandle}
              </span>
            </div>
          </div>

          {/* Guidelines disclaimer */}
          <div className="p-3 bg-[#e9e8e7]/50 rounded-xl flex items-start gap-2.5 text-[10px] text-gray-500 leading-normal font-sans">
            <AlertCircle className="w-4 h-4 text-[#72787c] shrink-0 mt-0.5" />
            <span>
              Anonymous creations are protected and can be claimed by the original creator at any time from the Profile panel.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
