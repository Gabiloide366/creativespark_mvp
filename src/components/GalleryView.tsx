import { useState, useRef } from "react";
import { Submission } from "../types";
import { Heart, Share2, Grid, Layers, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GalleryViewProps {
  submissions: Submission[];
  onLikeSubmission: (id: string) => void;
  onOpenSubmissionDetail: (sub: Submission) => void;
}

export default function GalleryView({
  submissions,
  onLikeSubmission,
  onOpenSubmissionDetail
}: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "portfolio">("grid");
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [likedNotification, setLikedNotification] = useState<string | null>(null);

  // Categories list
  const categories = ["All", "Digital Art", "Illustration", "Concept", "Abstract"];

  // Filter items
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedCategory === "All") return true;
    return sub.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Handle Double Tap like simulation
  const lastTap = useRef<{ [key: string]: number }>({});
  const handleDoubleTap = (subId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap.current[subId] && now - lastTap.current[subId] < DOUBLE_PRESS_DELAY) {
      // Trigger like
      onLikeSubmission(subId);
      // Show heart animation
      setLikedNotification(subId);
      setTimeout(() => setLikedNotification(null), 1000);
    } else {
      lastTap.current[subId] = now;
    }
  };

  // Portfolio carousel controls
  const nextPortfolio = () => {
    setPortfolioIndex((prev) => (prev + 1) % filteredSubmissions.length);
  };
  const prevPortfolio = () => {
    setPortfolioIndex((prev) => (prev - 1 + filteredSubmissions.length) % filteredSubmissions.length);
  };

  // Share link action simulation
  const [shareToast, setShareToast] = useState(false);
  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f8] relative">
      {/* Search & Mode Switch Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1c1c] tracking-tight">Community Gallery</h1>
          <p className="text-[11px] text-gray-400 font-sans">Exploring anonymous & autorial creations</p>
        </div>

        {/* View mode toggle widget */}
        <div className="flex bg-[#eeeeed] p-0.5 rounded-lg border border-[#c1c7cc]/40">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-[#3f6375] shadow-xs" : "text-gray-400"}`}
            title="Mosaic Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("portfolio")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "portfolio" ? "bg-white text-[#3f6375] shadow-xs" : "text-gray-400"}`}
            title="Portfolio Slider"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Scroller Tab */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPortfolioIndex(0); // Reset index
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-[#3f6375] text-white border-[#3f6375] shadow-sm shadow-[#3f6375]/15"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {shareToast && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-[#1a1c1c] text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-sans font-medium whitespace-nowrap">
            <span>🔗</span> Link copied! Ready to share.
          </div>
        )}
      </AnimatePresence>

      {/* Content Rendering Block */}
      <div className="px-5 flex-1 flex flex-col min-h-0">
        {filteredSubmissions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-2xl border border-dashed border-gray-200 my-4">
            <span className="text-3xl">🧩</span>
            <h3 className="font-bold text-sm text-[#1a1c1c] mt-2">No artworks in this category</h3>
            <p className="text-xs text-gray-400 max-w-[200px] mt-1">Be the first to submit a creation to this category!</p>
          </div>
        ) : viewMode === "grid" ? (
          // GRID VIEW (Bento Layout style matching screenshots)
          <div className="grid grid-cols-2 gap-3.5 pb-24">
            {filteredSubmissions.map((sub, index) => {
              // Asymmetric bento visual layout algorithm
              const isWide = index % 5 === 2;
              return (
                <div 
                  key={sub.id}
                  onClick={() => onOpenSubmissionDetail(sub)}
                  className={`bg-white border border-[#c1c7cc] rounded-2xl overflow-hidden cursor-pointer group hover:border-[#3f6375] transition-all shadow-xs flex flex-col ${
                    isWide ? "col-span-2 flex-row aspect-video" : "col-span-1"
                  }`}
                >
                  {/* Card Art content */}
                  <div className={`relative overflow-hidden bg-[#f4f3f2] ${isWide ? "w-1/2 h-full" : "aspect-[3/4]"}`}>
                    <img 
                      src={sub.image} 
                      alt={sub.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      onClick={() => handleDoubleTap(sub.id)}
                    />
                    
                    {/* Double Tap Heart Like pop up feedback overlay */}
                    <AnimatePresence>
                      {likedNotification === sub.id && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1, 0] }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 text-white pointer-events-none"
                        >
                          <Heart className="w-14 h-14 text-red-500 fill-red-500 shadow-md" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Details section */}
                  <div className={`p-3 flex flex-col justify-between ${isWide ? "w-1/2" : ""}`}>
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] text-gray-400 font-bold font-sans">
                          {sub.isAnonymous ? "Anonymous" : sub.artistName || "Member"}
                        </span>
                        {sub.isFeatured && (
                          <span className="text-[8px] bg-amber-100 text-amber-700 font-extrabold px-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-[#1a1c1c] truncate leading-tight group-hover:text-[#3f6375] transition-colors">
                        {sub.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeSubmission(sub.id);
                        }}
                        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#ba1a1a] transition-all"
                      >
                        <Heart className={`w-3.5 h-3.5 ${sub.likes > 2000 ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-gray-400 hover:text-[#ba1a1a]"}`} />
                        <span>{sub.likes}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                        className="p-1 text-gray-400 hover:text-[#3f6375] rounded-full hover:bg-gray-100"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // PORTFOLIO PORTRAIT SLIDER (Intuitive swipe cards gesture design)
          <div className="flex-1 flex flex-col pb-24 justify-center py-2 h-full">
            <span className="text-[10px] font-extrabold tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 uppercase self-center mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Portfolio Showcase</span>
            </span>

            <div className="relative w-full max-w-[320px] aspect-[3/4] mx-auto flex items-center justify-center">
              {/* Previous card ghost backing layer */}
              {filteredSubmissions[(portfolioIndex - 1 + filteredSubmissions.length) % filteredSubmissions.length] && (
                <div className="absolute w-[90%] h-[90%] bg-white border border-[#c1c7cc] rounded-3xl -rotate-6 scale-95 opacity-40 shadow-xs pointer-events-none transform -translate-x-4" />
              )}
              {/* Next card ghost backing layer */}
              {filteredSubmissions[(portfolioIndex + 1) % filteredSubmissions.length] && (
                <div className="absolute w-[90%] h-[90%] bg-white border border-[#c1c7cc] rounded-3xl rotate-6 scale-95 opacity-40 shadow-xs pointer-events-none transform translate-x-4" />
              )}

              {/* Main Swiping Card */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={portfolioIndex}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute w-[95%] h-[95%] bg-white border-2 border-[#3f6375]/30 rounded-[28px] overflow-hidden flex flex-col shadow-md group cursor-pointer"
                  onClick={() => onOpenSubmissionDetail(filteredSubmissions[portfolioIndex])}
                >
                  <div className="flex-1 relative bg-gray-100 overflow-hidden">
                    <img 
                      src={filteredSubmissions[portfolioIndex].image} 
                      alt={filteredSubmissions[portfolioIndex].title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                      onClick={() => handleDoubleTap(filteredSubmissions[portfolioIndex].id)}
                    />
                    
                    {/* Floating Hearts Double Tap Indicator */}
                    <AnimatePresence>
                      {likedNotification === filteredSubmissions[portfolioIndex].id && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0.6, 1.3, 1], opacity: [0, 1, 1, 0] }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 text-white pointer-events-none"
                        >
                          <Heart className="w-16 h-16 text-red-500 fill-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Badge Category overlay */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 text-[10px] font-extrabold text-[#3f6375]">
                      {filteredSubmissions[portfolioIndex].category}
                    </div>
                  </div>

                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">
                          {filteredSubmissions[portfolioIndex].isAnonymous ? "Anonymous" : filteredSubmissions[portfolioIndex].artistName || "Member"}
                        </span>
                        <h2 className="text-sm font-extrabold text-[#1a1c1c] tracking-tight mt-1">
                          {filteredSubmissions[portfolioIndex].title}
                        </h2>
                      </div>
                      
                      {/* Double tap instruction label */}
                      <span className="text-[9px] text-[#7da1b5] font-sans font-bold italic">Double tap to like</span>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeSubmission(filteredSubmissions[portfolioIndex].id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-500 font-extrabold hover:text-[#ba1a1a]"
                      >
                        <Heart className={`w-4 h-4 ${filteredSubmissions[portfolioIndex].likes > 2000 ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-gray-400"}`} />
                        <span>{filteredSubmissions[portfolioIndex].likes}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                        className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#3f6375] hover:bg-gray-100"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel navigation triggers slider */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button 
                onClick={prevPortfolio}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-xs flex items-center justify-center text-[#3f6375] active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                {portfolioIndex + 1} of {filteredSubmissions.length}
              </span>

              <button 
                onClick={nextPortfolio}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-xs flex items-center justify-center text-[#3f6375] active:scale-95 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
