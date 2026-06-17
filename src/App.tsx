import { useEffect, useState } from "react";
import MobileFrame from "./components/MobileFrame";
import BlobBackground from "./components/BlobBackground";
import ChallengeDetail from "./components/ChallengeDetail";
import GalleryView from "./components/GalleryView";
import UploadForm from "./components/UploadForm";
import ProfileView from "./components/ProfileView";
import SubmissionDetailModal from "./components/SubmissionDetailModal";
import { defaultSubmissions, defaultArtist } from "./data";
import { Submission, Artist } from "./types";
import { Home as HomeIcon, Palette, PlusCircle, User } from "lucide-react";
import { supabase } from './lib/supabase'
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"inicio" | "galeria" | "enviar" | "perfil">("inicio");
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    if (typeof window === "undefined") return defaultSubmissions;

    try {
      const stored = window.localStorage.getItem("creativeSparkSubmissions");
      if (!stored) return defaultSubmissions;
      const parsed = JSON.parse(stored) as Submission[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSubmissions;
    } catch {
      return defaultSubmissions;
    }
  });
  const [artist, setArtist] = useState<Artist>(defaultArtist);
  const [selectedDetailedSubmission, setSelectedDetailedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    async function loadSavedSubmissions() {
      try {
        const { data, error } = await supabase
          .from<Submission>("submissions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load saved submissions:", error);
          return;
        }

        if (data && data.length > 0) {
          setSubmissions((prev) => {
            const savedIds = new Set(data.map((saved) => saved.id));
            const localOnly = prev.filter((item) => !savedIds.has(item.id));
            const mergedDefaults = defaultSubmissions.filter(
              (defaultSub) => !savedIds.has(defaultSub.id) && !localOnly.some((local) => local.id === defaultSub.id)
            );
            return [...data, ...localOnly, ...mergedDefaults];
          });
        }
      } catch (error) {
        console.error("Supabase load error:", error);
      }
    }

    loadSavedSubmissions();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("creativeSparkSubmissions", JSON.stringify(submissions));
    } catch {
      // ignore storage errors
    }
  }, [submissions]);

  // Like interaction callback
  const handleLikeSubmission = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, likes: sub.likes + 1 };
        }
        return sub;
      })
    );
    // Also update current active overlay details if open
    if (selectedDetailedSubmission && selectedDetailedSubmission.id === id) {
      setSelectedDetailedSubmission((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  // Reclaim / Claim anonymous drawing callback
  const handleClaimSubmission = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            isAnonymous: false,
            artistName: artist.name,
            artistHandle: artist.handle,
            artistAvatar: artist.avatar,
            likes: sub.likes + 5 // Free bonus feedback likes p/ claim!
          };
        }
        return sub;
      })
    );
    
    // Increment completed challenges dynamically
    setArtist((prev) => ({
      ...prev,
      challengesCompleted: prev.challengesCompleted + 1
    }));
  };

  // Upload Submission handler — now attempts to persist to Supabase storage and table
  const handleUploadSubmission = async (
    title: string,
    story: string,
    isAnon: boolean,
    image: string,
    category: string
  ) => {
    const localId = `sub_custom_${Date.now()}`
    const newSubmissionBase: Omit<Submission, 'id'> = {
      title,
      challengeId: "chal_botanicos",
      image,
      likes: Math.floor(Math.random() * 20) + 1,
      comments: 0,
      shares: 0,
      date: new Date().toISOString().split("T")[0],
      isAnonymous: isAnon,
      isFeatured: false,
      category,
      story,
    }

    // Try to upload the image to Supabase Storage and insert a record in the 'submissions' table.
    try {
      // Convert data URL (base64) to Blob
      const blob = await (await fetch(image)).blob();
      const mime = blob.type || 'image/png'
      const ext = mime.split('/')[1] || 'png'
      const fileName = `sub_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, blob, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from('submissions').getPublicUrl(fileName)
      const imageUrl = (publicData && (publicData as any).publicUrl) || image

      // Prepare record for DB insert. If your table uses different column names, adjust accordingly.
      const dbRecord = {
        id: localId,
        title,
        challengeId: 'chal_botanicos',
        image: imageUrl,
        likes: newSubmissionBase.likes,
        comments: 0,
        shares: 0,
        date: newSubmissionBase.date,
        isAnonymous: isAnon,
        isFeatured: false,
        category,
        story,
      }

      const { error: insertError } = await supabase.from('submissions').insert(dbRecord)
      if (insertError) throw insertError

      // On success, use the persisted image URL
      const persistedSubmission: Submission = {
        id: localId,
        ...(newSubmissionBase as Submission),
        image: imageUrl,
        ...(isAnon ? {} : {
          artistName: artist.name,
          artistHandle: artist.handle,
          artistAvatar: artist.avatar
        })
      }

      setSubmissions((prev) => [persistedSubmission, ...prev])
      setActiveTab(isAnon ? 'galeria' : 'perfil')
      return
    } catch (err) {
      console.error('Supabase persist failed, falling back to local:', err)
    }

    // Fallback: keep previous local behavior when Supabase fails or isn't configured
    const newSubmission: Submission = {
      id: localId,
      ...(newSubmissionBase as Submission),
      ...(isAnon ? {} : {
        artistName: artist.name,
        artistHandle: artist.handle,
        artistAvatar: artist.avatar
      })
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setActiveTab(isAnon ? "galeria" : "perfil"); // Take to respective folder grid on success
  };

  const handleOpenDetail = (sub: Submission) => {
    setSelectedDetailedSubmission(sub);
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-800 flex items-center justify-center bg-radial-[circle_at_center,#1e293b_0%,#0f172a_100%]">
      {/* Decorative Blob Ambient Elements outside phone chassis */}
      <BlobBackground />

      {/* Main emulation platform screen */}
      <MobileFrame activeTab={activeTab}>
        <div className="flex-1 flex flex-col justify-between h-full min-h-0 relative select-none">
          {/* Active viewport routing dispatcher */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative select-none">
            <AnimatePresence mode="wait">
              {activeTab === "inicio" && (
                <motion.div
                  key="inicio"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full"
                >
                  <ChallengeDetail
                    onParticipate={() => setActiveTab("enviar")}
                    submissions={submissions}
                    onLikeSubmission={handleLikeSubmission}
                    onOpenSubmissionDetail={handleOpenDetail}
                    onNavigateToGallery={() => setActiveTab("galeria")}
                  />
                </motion.div>
              )}

              {activeTab === "galeria" && (
                <motion.div
                  key="galeria"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full"
                >
                  <GalleryView
                    submissions={submissions}
                    onLikeSubmission={handleLikeSubmission}
                    onOpenSubmissionDetail={handleOpenDetail}
                  />
                </motion.div>
              )}

              {activeTab === "enviar" && (
                <motion.div
                  key="enviar"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full"
                >
                  <UploadForm
                    onCancel={() => setActiveTab("inicio")}
                    onSubmit={handleUploadSubmission}
                  />
                </motion.div>
              )}

              {activeTab === "perfil" && (
                <motion.div
                  key="perfil"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-full"
                >
                  <ProfileView
                    artist={artist}
                    submissions={submissions}
                    onClaimSubmission={handleClaimSubmission}
                    onOpenSubmissionDetail={handleOpenDetail}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fixed bottom Navigation shell matching beautiful mockup design */}
          <nav className="absolute bottom-0 inset-x-0 h-20 bg-[#faf9f8] backdrop-blur-md border-t border-[#e9e8e7] px-6 py-2 flex items-center justify-around z-40 shadow-lg shadow-black/10 select-none">
            {/* INÍCIO (Home) */}
            <button
              onClick={() => setActiveTab("inicio")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                activeTab === "inicio"
                  ? "bg-[#ffbb8c] text-[#794823] scale-[1.02]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
              }`}
            >
              <HomeIcon className="w-5 h-5" strokeWidth={activeTab === "inicio" ? 2.5 : 2} />
              <span className="text-[10px] font-extrabold font-sans mt-0.5 tracking-tight">Home</span>
            </button>

            {/* GALERIA (Gallery) */}
            <button
              onClick={() => setActiveTab("galeria")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                activeTab === "galeria"
                  ? "bg-[#ffbb8c] text-[#794823] scale-[1.02]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
              }`}
            >
              <Palette className="w-5 h-5" strokeWidth={activeTab === "galeria" ? 2.5 : 2} />
              <span className="text-[10px] font-extrabold font-sans mt-0.5 tracking-tight">Gallery</span>
            </button>

            {/* ENVIAR (Upload) */}
            <button
              onClick={() => setActiveTab("enviar")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                activeTab === "enviar"
                  ? "bg-[#ffbb8c] text-[#794823] scale-[1.02]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
              }`}
            >
              <PlusCircle className="w-5 h-5" strokeWidth={activeTab === "enviar" ? 2.5 : 2} />
              <span className="text-[10px] font-extrabold font-sans mt-0.5 tracking-tight">Upload</span>
            </button>

            {/* PERFIL (Profile) */}
            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                activeTab === "perfil"
                  ? "bg-[#ffbb8c] text-[#794823] scale-[1.02]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5" strokeWidth={activeTab === "perfil" ? 2.5 : 2} />
              <span className="text-[10px] font-extrabold font-sans mt-0.5 tracking-tight">Profile</span>
            </button>
          </nav>
        </div>

        {/* Zoom image light box overlay modal detail */}
        <AnimatePresence>
          {selectedDetailedSubmission && (
            <SubmissionDetailModal
              submission={selectedDetailedSubmission}
              onClose={() => setSelectedDetailedSubmission(null)}
              onLike={handleLikeSubmission}
            />
          )}
        </AnimatePresence>
      </MobileFrame>
    </div>
  );
}
