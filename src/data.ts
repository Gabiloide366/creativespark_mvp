import { Challenge, Submission, Artist } from "./types";

export const defaultArtist: Artist = {
  name: "Alex Rivera",
  handle: "@alex_rivera",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  bio: "Aspiring Illustrator • On the journey since 2023",
  streak: 12,
  challengesCompleted: 24,
  totalLikes: 1200
};

export const defaultChallenge: Challenge = {
  id: "chal_botanicos",
  title: "Abstract Botanicals",
  description: "Merge geometry with organic elements. This week, we explore how botanical shapes can be simplified into abstract forms while preserving their natural essence.",
  timeRemaining: "3d 14h 22m",
  badges: ["Illustration", "Abstract", "Weekly"],
  mainImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
};

export const defaultSubmissions: Submission[] = [
  {
    id: "sub_1",
    title: "Ethereal Flora",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&auto=format&fit=crop",
    likes: 2400,
    comments: 342,
    shares: 128,
    date: "2026-05-26",
    isAnonymous: true,
    isFeatured: true,
    category: "Abstract",
    story: "My inspiration came from the fluidity with which petals react to the afternoon breeze. I tried to capture the faded colors that sunlight creates on the petals."
  },
  {
    id: "sub_2",
    title: "Organic Leaves",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop",
    likes: 124,
    comments: 18,
    shares: 24,
    date: "2026-05-25",
    isAnonymous: true,
    isFeatured: false,
    category: "Illustration",
    story: "Leaf shapes simplified in desaturated pastel tones. The idea was to create something that would bring calm and tranquility to the viewer."
  },
  {
    id: "sub_3",
    title: "Floral Geometry",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
    likes: 98,
    comments: 5,
    shares: 12,
    date: "2026-05-24",
    isAnonymous: true,
    isFeatured: false,
    category: "Digital Art",
    story: "Mathematical intersections applied to organic petals. Circles and rectangles forming the essence of a mechanical daisy."
  },
  {
    id: "sub_4",
    title: "Cosmic Vision",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    likes: 312,
    comments: 42,
    shares: 56,
    date: "2026-05-23",
    isAnonymous: false,
    isFeatured: false,
    category: "Concept",
    artistName: "Alex Rivera",
    artistHandle: "@alex_rivera",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    story: "A central eye observing the flower of the universe. Combining fine pointillism and golden strokes."
  },
  {
    id: "sub_5",
    title: "Splash Theory",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=600&auto=format&fit=crop",
    likes: 215,
    comments: 31,
    shares: 19,
    date: "2026-05-22",
    isAnonymous: false,
    isFeatured: false,
    category: "Digital Art",
    artistName: "Alex Rivera",
    artistHandle: "@alex_rivera",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    story: "Chromatic explosion based on organic dyes extracted from wild berries. Pure abstractionism at high speed."
  },
  {
    id: "sub_6",
    title: "Sun Bloom",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a6211?q=80&w=600&auto=format&fit=crop",
    likes: 94,
    comments: 11,
    shares: 4,
    date: "2026-05-21",
    isAnonymous: false,
    isFeatured: false,
    category: "Illustration",
    artistName: "Alex Rivera",
    artistHandle: "@alex_rivera",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    story: "The first rays of sun hitting the secret home garden. Warm terracotta tones."
  },
  // Anonymous submissions in artist's profile waiting to be claimed
  {
    id: "sub_anon_1",
    title: "Color Symphony",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600&auto=format&fit=crop",
    likes: 42,
    comments: 12,
    shares: 8,
    date: "2026-05-26",
    isAnonymous: true,
    isFeatured: false,
    category: "Abstract",
    story: "Experimentation with floating gradients of blue and peach, combining amoeboid curves."
  },
  {
    id: "sub_anon_2",
    title: "Wild Bush",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=600&auto=format&fit=crop",
    likes: 89,
    comments: 24,
    shares: 15,
    date: "2026-05-25",
    isAnonymous: true,
    isFeatured: false,
    category: "Illustration",
    story: "Organic contemporary illustration showing branches and leaves painted with an autumn palette."
  },
  {
    id: "sub_anon_3",
    title: "Stellar Wave",
    challengeId: "chal_botanicos",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
    likes: 154,
    comments: 29,
    shares: 20,
    date: "2026-05-18",
    isAnonymous: true,
    isFeatured: false,
    category: "Digital Art",
    story: "Born from a sketch of flowing midnight waves. Wanted to see how energy moves through abstract flowers."
  }
];

export const mockCommunityFeed = [
  {
    id: "feed_1",
    user: "Alex Rivera",
    action: "just joined the challenge",
    time: "2 minutes ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "feed_2",
    user: "Jordan Santos",
    action: "shared progress on 'Floral Geometry'",
    time: "15 minutes ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "feed_3",
    user: "Elena G.",
    action: "claimed the artwork 'Ethereal Flora'!",
    time: "1 hour ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
  }
];
