import { useState, useEffect } from "react";
import { Challenge, Submission } from "../types";
import { defaultChallenge, mockCommunityFeed } from "../data";
import { Clock, ArrowRight, Heart, MessageSquare, Sparkles, Bell, ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChallengeDetailProps {
  onParticipate: () => void;
  submissions: Submission[];
  onLikeSubmission: (id: string) => void;
  onOpenSubmissionDetail: (sub: Submission) => void;
  onNavigateToGallery: () => void;
}

export default function ChallengeDetail({
  onParticipate,
  submissions,
  onLikeSubmission,
  onOpenSubmissionDetail,
  onNavigateToGallery
}: ChallengeDetailProps) {
  // Mock notifications trigger
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDeepView, setIsDeepView] = useState(false);

  const handleNotificationClick = () => {
    if (notificationCount > 0) {
      setNotificationCount(0);
      setToastMessage("Your notifications have been marked as read! 🔔");
    } else {
      setNotificationCount(3);
      setToastMessage("Simulation mode: New artworks submitted by the community!");
    }
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 2800);
  };

  // Only display submissions related to this week's Botanics challenge
  // (sub_1, sub_2, sub_3 are the botanics ones in the default list)
  const botanicSubmissions = submissions.filter(s => s.challengeId === "chal_botanicos").slice(0, 3);

  // Sorting featured (Flora Etérea) and normal ones
  const featured = botanicSubmissions.find(s => s.isFeatured) || botanicSubmissions[0];
  const normals = botanicSubmissions.filter(s => !s.isFeatured);

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f8] relative">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#faf9f8]/90 backdrop-blur-md px-5 h-14 flex items-center justify-between border-b border-[#e9e8e7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3f6375] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#3f6375]/10">
            C
          </div>
          <span className="font-sans font-bold text-lg text-[#3f6375] tracking-tight">CreativeSpark</span>
        </div>
        
        <button 
          onClick={handleNotificationClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#eeeeed] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#41484c]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-sans font-extrabold flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Main scrollable area */}
      <div className="px-5 py-4 space-y-6">
        {/* Toast Notification Notification */}
        <AnimatePresence>
          {showNotificationToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-[#3f6375] text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-40 relative"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isDeepView ? (
            <motion.div
              key="deep-challenge-sub-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Back Link with Left Arrow as shown in screenshot */}
              <button 
                onClick={() => setIsDeepView(false)}
                className="flex items-center gap-2 -ml-1 py-1 px-2 rounded-lg hover:bg-gray-100 text-[#41484c] text-xs font-extrabold transition-all active:scale-95 outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {/* High precision visual image with countdown and text overlay matching mockup */}
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop" 
                    alt="Botânicos Abstratos Banner" 
                    className="w-full h-full object-cover"
                  />
                  {/* Visual gradient filter to lock text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  {/* Floating Timer Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 text-[#794823] text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-orange-100/30 flex items-center gap-1.5 shadow-md">
                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>3d 14h remaining</span>
                  </div>

                  {/* Text Overlays - DESAFIO SEMANAL & Botânicos Abstratos */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-[9px] bg-white/25 text-white/95 backdrop-blur-xs font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                      Weekly Challenge
                    </span>
                    <h2 className="text-xl font-black text-white leading-tight mt-1 tracking-tight truncate">
                      Abstract Botanicals
                    </h2>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <p className="text-gray-600 text-xs leading-relaxed font-sans px-1">
                Merge geometry with organic elements. This week, we explore how botanical shapes can be simplified into abstract forms while preserving their natural essence.
              </p>

              {/* Category Badges row */}
              <div className="flex flex-wrap gap-2 px-1">
                <span className="bg-[#f0f4f8] text-[#3f6375] text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-[#d6e3ec]/60">
                  Illustration
                </span>
                <span className="bg-[#fdf3ec] text-[#b95e34] text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-[#fbdcc9]/60">
                  Abstract
                </span>
                <span className="bg-[#fcf0f2] text-[#ba1a1a] text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-[#fad3da]/60">
                  Weekly
                </span>
              </div>

              {/* Huge filled main action button matching mockup */}
              <button 
                onClick={onParticipate}
                className="w-full bg-[#3f6375] hover:bg-[#32505f] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all active:scale-95 shadow-md shadow-[#3f6375]/10 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>Participate</span>
              </button>

              {/* Related submissions */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1a1c1c] tracking-tight">
                    Explore Submissions
                  </h3>
                  <button 
                    onClick={onNavigateToGallery}
                    className="text-[#3f6375] font-sans font-extrabold text-[11px] flex items-center gap-0.5 hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Submissions feed - Side-by-Side normals on top, featured on bottom */}
                <div className="grid grid-cols-2 gap-3.5 pb-8">
                  {normals.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => onOpenSubmissionDetail(item)}
                      className="bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden flex flex-col cursor-pointer group hover:border-[#3f6375] transition-all shadow-sm"
                    >
                      <div className="aspect-square relative bg-[#f4f3f2] overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                      <div className="p-2.5">
                        <h4 className="font-extrabold text-[11px] text-[#1a1c1c] truncate mb-1.5 group-hover:text-[#3f6375]">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[#72787c]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeSubmission(item.id);
                            }}
                            className="flex items-center gap-1 text-[9px] font-bold hover:text-[#ba1a1a] transition-all"
                          >
                            <Heart className="w-3.5 h-3.5 text-[#ba1a1a] fill-[#ba1a1a]" />
                            <span>{item.likes}</span>
                          </button>
                          <div className="flex items-center gap-1 text-[9px] font-bold">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Featured element spanning bottom row matching the mockup exactly */}
                  {featured && (
                    <div 
                      onClick={() => onOpenSubmissionDetail(featured)}
                      className="col-span-2 bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden flex cursor-pointer group hover:border-[#3f6375] transition-all shadow-sm mt-0.5"
                    >
                      <div className="w-2/5 aspect-square relative bg-[#f4f3f2] overflow-hidden">
                        <img 
                          src={featured.image} 
                          alt={featured.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                      <div className="w-3/5 p-3.5 flex flex-col justify-between">
                        <div>
                          <span className="bg-[#ffd8e6] text-[#623b4c] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
                            Featured
                          </span>
                          <h3 className="font-extrabold text-xs text-[#1a1c1c] tracking-tight group-hover:text-[#3f6375] transition-colors mt-0.5">
                            {featured.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-normal font-sans">
                            {featured.story || "Contribuição especial da comunidade de artistas no desafio."}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 text-[#41484c]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeSubmission(featured.id);
                            }}
                            className="flex items-center gap-1 text-[10px] font-semibold hover:text-[#ba1a1a]"
                          >
                            <Heart className="w-3.5 h-3.5 fill-[#ba1a1a] text-[#ba1a1a]" />
                            <span>{featured.likes}</span>
                          </button>
                          <div className="flex items-center gap-1 text-[10px] font-semibold">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <span>{featured.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main-overview-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Hero Challenge Title Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border border-amber-200">
                    ACTIVE CHALLENGE
                  </span>
                  <div className="flex items-center gap-1 text-[#3f6375] font-sans font-bold text-xs bg-[#c3e8fd]/40 px-2.5 py-1 rounded-full border border-[#a7cce1]/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>3d 14h 22m</span>
                  </div>
                </div>

                {/* Highly requested fully clickable Active Challenge Hero Card! */}
                <div 
                  onClick={() => setIsDeepView(true)}
                  className="relative rounded-2xl overflow-hidden border border-[#c1c7cc] bg-white group shadow-sm transition-transform hover:scale-[1.015] active:scale-[0.985] duration-300 cursor-pointer hover:border-[#3f6375]/70"
                >
                  {/* Main Header visual */}
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop" 
                      alt="Botânicos Abstratos Banner" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-extrabold text-[#1a1c1c] tracking-tight group-hover:text-[#3f6375] transition-colors">{defaultChallenge.title}</h1>
                      <span className="text-[10px] text-[#3f6375] font-extrabold flex items-center gap-0.5 group-hover:underline">
                        View Details ➔
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed font-sans">{defaultChallenge.description}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-1">
                      {defaultChallenge.badges.map((b, idx) => (
                        <span 
                          key={idx}
                          className="bg-[#eee] text-[#41484c] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#c1c7cc]/50"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onParticipate();
                      }}
                      className="w-full mt-2 bg-[#3f6375] hover:bg-[#32505f] text-[#ffffff] font-bold text-xs py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-[#3f6375]/10 flex items-center justify-center gap-2"
                    >
                      <span>Participate in Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explorar Envios Gallery Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#1a1c1c] tracking-tight flex items-center gap-1.5">
                    <span>🎨</span> Explore Submissions
                  </h2>
                  <button 
                    onClick={onNavigateToGallery}
                    className="text-[#3f6375] font-sans font-bold text-xs flex items-center gap-0.5 hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Grid Layout conforming to beautiful screenshot */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Featured Item (Spans full columns dynamically like Bento Grid) */}
                  {featured && (
                    <div 
                      onClick={() => onOpenSubmissionDetail(featured)}
                      className="col-span-2 bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden flex cursor-pointer group hover:border-[#3f6375] transition-all shadow-sm"
                    >
                      <div className="w-2/5 aspect-square relative bg-[#f4f3f2] overflow-hidden">
                        <img 
                          src={featured.image} 
                          alt={featured.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                      <div className="w-3/5 p-3.5 flex flex-col justify-between">
                        <div>
                          <span className="bg-[#ffd8e6] text-[#623b4c] text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider mb-1.5 inline-block">
                            Featured
                          </span>
                          <h3 className="font-bold text-xs text-[#1a1c1c] tracking-tight group-hover:text-[#3f6375] transition-colors">
                            {featured.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-normal font-sans">
                            {featured.story || "Special community contribution to the challenge."}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 text-[#41484c]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeSubmission(featured.id);
                            }}
                            className="flex items-center gap-1 text-[10px] font-semibold hover:text-[#ba1a1a]"
                          >
                            <Heart className="w-3.5 h-3.5 fill-[#ba1a1a] text-[#ba1a1a]" />
                            <span>{featured.likes}</span>
                          </button>
                          <div className="flex items-center gap-1 text-[10px] font-semibold">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <span>{featured.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Normals Gallery previews */}
                  {normals.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => onOpenSubmissionDetail(item)}
                      className="bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden flex flex-col cursor-pointer group hover:border-[#3f6375] transition-all shadow-sm"
                    >
                      <div className="aspect-square relative bg-[#f4f3f2] overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                      <div className="p-2.5">
                        <h4 className="font-bold text-[11px] text-[#1a1c1c] truncate mb-1.5 group-hover:text-[#3f6375]">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-[#72787c]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeSubmission(item.id);
                            }}
                            className="flex items-center gap-1 text-[9px] font-bold hover:text-[#ba1a1a] transition-all"
                          >
                            <Heart className="w-3 h-3 text-[#ba1a1a] fill-[#ba1a1a]" />
                            <span>{item.likes}</span>
                          </button>
                          <div className="flex items-center gap-1 text-[9px] font-bold">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span>{item.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Activity Feed Stream */}
              <div className="space-y-3 pb-8">
                <h2 className="text-base font-bold text-[#1a1c1c] tracking-tight flex items-center gap-1.5">
                  <span>💬</span> Community Feed
                </h2>

                <div className="bg-white border border-[#c1c7cc] rounded-2xl p-4 divide-y divide-gray-100 shadow-sm">
                  {mockCommunityFeed.map((feed) => (
                    <div key={feed.id} className="first:pt-0 last:pb-0 py-3 flex items-start gap-3">
                      <img 
                        src={feed.avatar} 
                        alt={feed.user} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#1a1c1c] leading-normal font-sans">
                          <strong className="font-extrabold">{feed.user}</strong> {feed.action}
                        </p>
                        <span className="text-[10px] text-gray-400 font-sans block mt-0.5">{feed.time}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#7da1b5] mt-1.5 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
