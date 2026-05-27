export interface Artist {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  streak: number;
  challengesCompleted: number;
  totalLikes: number;
}

export interface Submission {
  id: string;
  title: string;
  challengeId: string;
  image: string;
  artistName?: string;
  artistHandle?: string;
  artistAvatar?: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  isAnonymous: boolean;
  isFeatured: boolean;
  category: string;
  story?: string;
  claimedAt?: string; // If claimed, when
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  timeRemaining: string;
  badges: string[];
  mainImage: string;
}
