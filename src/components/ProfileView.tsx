import { useState } from "react";
import { Artist, Submission } from "../types";
import { Trophy, Flame, Heart, MessageSquare, ArrowRight, CheckCircle2, Award, Sparkles, Share2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfileViewProps {
  artist: Artist;
  submissions: Submission[];
  onClaimSubmission: (id: string) => void;
  onOpenSubmissionDetail: (sub: Submission) => void;
}

export default function ProfileView({
  artist,
  submissions,
  onClaimSubmission,
  onOpenSubmissionDetail
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"public" | "anonymous">("public");
  const [claimToast, setClaimToast] = useState<{ show: boolean, name: string }>({ show: false, name: "" });

  // Get anonymity status details (1 week mandatory lockdown period)
  const getAnonymityStatus = (dateStr: string) => {
    const today = new Date("2026-05-27T13:05:54Z");
    const uploadDate = new Date(dateStr + "T12:00:00Z");
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const diffMs = today.getTime() - uploadDate.getTime();
    
    if (diffMs >= oneWeekMs) {
      return {
        isLocked: false,
        remainingText: "Ready to claim",
        badgeColor: "bg-[#e2f1cd]/95 text-[#4d6628] border-[#a9ce7e]/40"
      };
    } else {
      const remainingMs = oneWeekMs - diffMs;
      const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      
      let timeText = `${days} days remaining`;
      if (days === 0) {
        timeText = `${hours}h remaining`;
      } else if (days === 1) {
        timeText = `1 day remaining`;
      }
      
      return {
        isLocked: true,
        remainingText: timeText,
        badgeColor: "bg-[#ffe0ce]/95 text-[#8c3f23] border-[#ffbb8c]/30"
      };
    }
  };

  // Filter Alex's items
  // Public submissions for Alex Rivera (by artistName or when not anonymous and artistName is Alex)
  const publicWorks = submissions.filter(
    (s) => !s.isAnonymous && s.artistName === artist.name
  );

  // Anonymous submissions belong to Alex (starting with sub_anon_ or uploaded custom ones with isAnonymous of the mock user)
  const anonymousWorks = submissions.filter(
    (s) => s.isAnonymous && (s.id.startsWith("sub_anon_") || s.id.startsWith("sub_custom_"))
  );

  const handleClaimClick = (subId: string, subTitle: string) => {
    onClaimSubmission(subId);
    setClaimToast({ show: true, name: subTitle });
    setTimeout(() => {
      setClaimToast({ show: false, name: "" });
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f8] relative">
      {/* Top Banner Cover gradient (warm aesthetic layout) */}
      <div className="h-20 w-full bg-gradient-to-r from-[#ffdcc6] via-[#ffd8e6] to-[#c3e8fd] opacity-60 z-0 absolute top-0 inset-x-0" />

      {/* Claim Toast HUD Overlay */}
      <AnimatePresence>
        {claimToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#103848] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-[#a7cce1]/20 font-sans font-medium whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Artwork <strong>"{claimToast.name}"</strong> is now public! 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 pt-12 pb-24 z-10 relative space-y-5">
        
        {/* Profile Info Header Display */}
        <section className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="relative">
            {/* Avatar container outline */}
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
              <img 
                src={artist.avatar} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Spark verified icon badge */}
            <div className="absolute bottom-0 right-0 bg-[#3f6375] text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              <Award className="w-3.5 h-3.5 fill-white text-[#3f6375]" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl font-extrabold text-[#1a1c1c] tracking-tight">{artist.name}</h1>
            <p className="text-xs text-gray-500 font-sans">{artist.bio}</p>
          </div>
        </section>

        {/* Statistics Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-[#c1c7cc] rounded-2xl p-4 flex flex-col justify-between shadow-xs aspect-[4/3]">
            <span className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase">
              CHALLENGES COMPLETED
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-xl font-black text-[#1a1c1c]">{artist.challengesCompleted + publicWorks.length}</span>
            </div>
          </div>

          <div className="bg-white border border-[#c1c7cc] rounded-2xl p-4 flex flex-col justify-between shadow-xs aspect-[4/3]">
            <span className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase">
              TOTAL LIKES
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <Heart className="w-5 h-5 text-[#ba1a1a] fill-[#ba1a1a] shrink-0" />
              <span className="text-xl font-black text-[#1a1c1c]">1.2k</span>
            </div>
          </div>

          {/* Golden Creative Streak Checklist (Streaks tracker) */}
          <div className="col-span-2 bg-[#ffbb8c]/15 border border-[#ffbb8c]/50 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs text-[#794823] flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span>Creative Streak</span>
              </h3>
              <p className="text-[10px] text-[#794823]/80 font-sans leading-normal">
                You created every day for the past <strong>12 days!</strong>
              </p>
            </div>
            
            <div className="bg-[#ffbb8c] text-[#794823] w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-sm">
              12
            </div>
          </div>
        </section>

        {/* past submissions tab with filters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1a1c1c] tracking-tight flex items-center gap-1.5">
              <span>🖼️</span> Creative Journey
            </h2>
            <div className="text-[10px] text-gray-400 font-sans font-semibold">
              Total: {publicWorks.length + anonymousWorks.length} artworks
            </div>
          </div>

          {/* Tabs switch */}
          <div className="flex border-b border-gray-100 gap-4">
            <button
              onClick={() => setActiveTab("public")}
              className={`pb-2 text-xs font-bold leading-none border-b-2 transition-colors cursor-pointer ${
                activeTab === "public"
                  ? "border-[#3f6375] text-[#3f6375]"
                  : "border-transparent text-gray-400 hover:text-gray-500"
              }`}
            >
              Public ({publicWorks.length})
            </button>
            <button
              onClick={() => setActiveTab("anonymous")}
              className={`pb-2 text-xs font-bold leading-none border-b-2 transition-colors cursor-pointer ${
                activeTab === "anonymous"
                  ? "border-[#3f6375] text-[#3f6375]"
                  : "border-transparent text-gray-400 hover:text-gray-500"
              }`}
            >
              Anonymous ({anonymousWorks.length})
            </button>
          </div>

          {/* Tab lists */}
          {activeTab === "public" ? (
            publicWorks.length === 0 ? (
              <div className="text-center py-8 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl">🌱</span>
                <p className="text-xs text-gray-400 mt-2 font-sans font-medium">No public artworks yet.</p>
                <span className="text-[9px] text-[#7da1b5] mt-1 italic">Claim them under the anonymous tab!</span>
              </div>
            ) : (
              // Public works grid (Flat clean rectangular card displaying)
              <div className="grid grid-cols-2 gap-3.5 pb-8">
                {publicWorks.map((work) => (
                  <div 
                    key={work.id}
                    onClick={() => onOpenSubmissionDetail(work)}
                    className="bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden cursor-pointer group hover:border-[#3f6375] transition-all shadow-xs"
                  >
                    <div className="aspect-square bg-slate-100 overflow-hidden relative">
                      <img 
                        src={work.image} 
                        alt={work.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                    </div>
                    <div className="p-2.5">
                      <h4 className="font-bold text-[11px] text-[#1a1c1c] truncate leading-tight group-hover:text-[#3f6375]">
                        {work.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <Heart className="w-3 h-3 text-[#ba1a1a] fill-[#ba1a1a]" />
                        <span className="text-[9px] font-bold">{work.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Anonymous claims screen (Reclamar anonym drawings)
            anonymousWorks.length === 0 ? (
              <div className="text-center py-8 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl">⚡</span>
                <p className="text-xs text-gray-400 mt-2 font-sans font-medium">You have no anonymous artworks ready.</p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">Submit new artworks using the anonymity trigger!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-8">
                {anonymousWorks.map((work) => {
                  const status = getAnonymityStatus(work.date);
                  return (
                    <div 
                      key={work.id}
                      className="bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden flex flex-col shadow-xs"
                    >
                      <div 
                        onClick={() => onOpenSubmissionDetail(work)}
                        className="aspect-video relative overflow-hidden bg-slate-100 cursor-pointer group"
                      >
                        <img 
                          src={work.image} 
                          alt={work.title} 
                          className="w-full h-full object-cover"
                        />
                        
                        {status.isLocked ? (
                          <div className="absolute top-3 left-3 bg-[#1a1c1c]/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 font-sans shadow-md">
                            <Lock className="w-2.5 h-2.5 text-amber-500" />
                            <span>Anonymous ({status.remainingText})</span>
                          </div>
                        ) : (
                          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 font-sans shadow-md">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Ready to Claim</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-xs text-[#1a1c1c] tracking-tight">
                              {work.title}
                            </h4>
                            <span className="text-[9px] text-gray-400 font-sans font-medium">Posted on {work.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1.5 text-gray-400">
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                              <Heart className="w-3.5 h-3.5" />
                              <span>{work.likes} Likes</span>
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{work.comments} Comments</span>
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold">
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{work.shares} Shares</span>
                            </span>
                          </div>
                        </div>

                        {/* Claim and Keep actions */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex gap-2.5">
                            {status.isLocked ? (
                              <button 
                                disabled
                                className="flex-1 bg-gray-100 border border-gray-200 text-gray-400 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-not-allowed"
                              >
                                <Lock className="w-3.5 h-3.5 text-gray-400" />
                                <span>Claim (Protected)</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleClaimClick(work.id, work.title)}
                                className="flex-1 bg-[#3f6375] hover:bg-[#32505f] text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1"
                              >
                                <span>Claim Artwork</span>
                              </button>
                            )}
                            
                            <button 
                              className="flex-1 border border-gray-200 text-[#41484c] text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
                              onClick={() => alert("Your artwork was kept 100% anonymous and secure in the gallery! 🛡️")}
                            >
                              Keep Anonymous
                            </button>
                          </div>
                          
                          {status.isLocked && (
                            <span className="text-[9px] text-[#3f6375] bg-[#f0f4f8] px-2.5 py-2 rounded-lg font-sans border border-[#d6e3ec]/80 block text-center leading-normal">
                              🔒 To allow you to fully enjoy your creation free from social media pressure and expectations of instant success, this artwork remains anonymous for 1 week ({status.remainingText} remaining).
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>

      </div>
    </div>
  );
}
