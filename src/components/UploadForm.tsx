import React, { useState, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadFormProps {
  onCancel: () => void;
  onSubmit: (title: string, story: string, isAnon: boolean, image: string, category: string) => void;
}

export default function UploadForm({ onCancel, onSubmit }: UploadFormProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Abstract");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
          // Set a default title if empty
          if (!title) {
            setTitle(e.target.files![0].name.replace(/\.[^/.]+$/, ""));
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsUploading(true);
    // Mimic database upload network lag
    setTimeout(() => {
      setIsUploading(false);
      setSuccessAnimation(true);
      
      setTimeout(() => {
        onSubmit(
          title || "Untitled",
          story,
          isAnon,
          selectedImage,
          selectedCategory
        );
      }, 1800);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf9f8] relative">
      {/* Upload Header Cancel close */}
      <div className="px-5 pt-4 flex justify-end">
        <button 
          onClick={onCancel}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-[#41484c] shadow-xs active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 pb-24 space-y-6">
        {/* Title Block */}
        <div>
          <h2 className="text-xl font-extrabold text-[#1a1c1c] tracking-tight">Share your creation</h2>
          <p className="text-xs text-gray-500 font-sans mt-1">Your contribution fuels the collective imagination of the community.</p>
        </div>

        {/* Input Form container */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* STEP 1: UPLOAD BOX */}
          <section className="bg-white border border-[#c1c7cc] p-4 rounded-2xl relative space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="bg-[#7da1b5] text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">
                1
              </span>
              <h3 className="font-bold text-xs text-[#1a1c1c] tracking-tight">Upload Image</h3>
            </div>

            {/* Hidden native input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Dotted Box interaction */}
            {!selectedImage ? (
              <div 
                onClick={handleBoxClick}
                className="border-2 border-dashed border-[#c1c7cc] hover:border-[#3f6375] rounded-xl aspect-[4/3] flex flex-col items-center justify-center bg-[#f4f3f2] cursor-pointer transition-colors p-4 text-center group"
              >
                <div className="bg-[#c3e8fd] text-[#3f6375] p-3 rounded-full mb-2 group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-gray-600 font-sans">Tap to browse or drop here</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">JPG, PNG UP TO 10MB</p>
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-inner group">
                <img 
                  src={selectedImage} 
                  alt="Selected Artwork Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay option to change image */}
                <div 
                  onClick={handleBoxClick}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold gap-1"
                >
                  <Upload className="w-4 h-4" />
                  <span>Change Image</span>
                </div>

                {/* Confirm indicator mark */}
                <div className="absolute top-2 right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </section>

          {/* Title & Category Config */}
          {selectedImage && (
            <section className="bg-white border border-[#c1c7cc] p-4 rounded-2xl space-y-3 shadow-xs">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#1a1c1c]">Artwork Title</label>
                <input 
                  type="text"
                  placeholder="e.g., Cerulean Flowers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f4f3f2] border border-[#c1c7cc] rounded-xl px-3 py-2 text-xs text-[#1a1c1c] focus:bg-white focus:ring-1 focus:ring-[#3f6375] outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1a1c1c]">Category</label>
                <div className="flex gap-2">
                  {["Abstract", "Illustration", "Digital Art", "Concept"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg border transition-all ${
                        selectedCategory === cat 
                          ? "bg-[#3f6375] text-white border-[#3f6375]" 
                          : "bg-[#f4f3f2] text-gray-500 border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2: STORY */}
          <section className="bg-white border border-[#c1c7cc] p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="bg-[#7da1b5] text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">
                2
              </span>
              <h3 className="font-bold text-xs text-[#1a1c1c] tracking-tight">Brief Story <span className="text-gray-400 font-normal">(Optional)</span></h3>
            </div>

            <textarea 
              rows={3}
              placeholder="Tell us the inspiration behind this artwork..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-[#f4f3f2] p-3 rounded-xl border border-[#c1c7cc] font-sans text-xs text-[#1a1c1c] resize-none h-24 focus:bg-white focus:ring-1 focus:ring-[#3f6375] outline-none leading-relaxed"
            />
          </section>

          {/* Submission action triggers */}
          <div className="space-y-2 pt-2 pb-6">
            <button 
              type="submit"
              disabled={!selectedImage || isUploading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md ${
                selectedImage 
                  ? "bg-[#3f6375] hover:bg-[#32505f] active:scale-95 cursor-pointer" 
                  : "bg-[#7da1b5]/60 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Uploading Creativity..." : "Submit Artwork"}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              className="w-full bg-transparent border border-[#3f6375] text-[#3f6375] hover:bg-slate-50 font-bold text-xs py-3.5 rounded-xl transition-all active:scale-95"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>

      {/* Upload Lag and success animation triggers */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#faf9f8]/95 flex flex-col items-center justify-center"
          >
            {/* Minimalist modern loader design */}
            <div className="w-16 h-16 border-4 border-[#faf9f8] border-t-[#3f6375] rounded-full animate-spin mb-4" />
            <span className="text-sm font-bold text-[#1a1c1c] tracking-tight">Cooking your creation...</span>
            <p className="text-xs text-gray-400 mt-1 font-sans">Uploading to the community mosaic</p>
          </motion.div>
        )}

        {successAnimation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#faf9f8]/98 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            <span className="text-base font-extrabold text-[#1a1c1c] tracking-tight">Uploaded Successfully! ✨</span>
            <p className="text-xs text-gray-500 mt-2 font-sans max-w-[220px]">
              Your creation has been added anonymously to the Gallery. It will remain 100% anonymous for exactly 1 week, and then will be released for claim under the Anonymous tab on your Profile.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
