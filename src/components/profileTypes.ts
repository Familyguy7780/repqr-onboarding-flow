export type Environment = "scanrep" | "repqr";
export type Tone = "Professional" | "Friendly" | "Bold" | "Premium" | "Energetic";
export type ProfessionType =
  | "personal"
  | "realtor"
  | "insurance"
  | "attorney"
  | "financial"
  | "healthcare";
export type PrimaryCtaType = "book" | "call" | "text" | "email" | "link";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  x: string;
  venmo: string;
  cashapp: string;
  custom1Label: string;
  custom1Url: string;
  custom2Label: string;
  custom2Url: string;
};

export type Badge = {
  label: string;
  value: string;
};

export type Profile = {
  destinationEnvironment: Environment | null;
  name: string;
  email: string;
  repUrl: string;
  professionType: ProfessionType;
  rawInput: string;
  title: string;
  company: string;
  tagline: string;
  shortBio: string;
  longDescription: string;
  primaryCtaLabel: string;
  primaryCtaType: PrimaryCtaType;
  primaryCtaValue: string;
  tone: Tone;
  keywords: string[];
  publicPhone: string;
  publicEmail: string;
  website: string;
  socialLinks: SocialLinks;
  badges: Badge[];
  profilePhoto: string | null;
  logo: string | null;
  brandColor: string;
  ctaCustomized: boolean;
};
