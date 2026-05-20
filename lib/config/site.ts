const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  url: string;
  ogImage: string;
  author: string;
  mainKeywords: string[];
  links: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  twitterHandle?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export const siteConfig: SiteConfig = {
  name: brandName || "Blue Eye Entertainment",
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || brandName || "BlueEye",
  description: `Book India's Top Artists - Singers, DJs, Comedians & more for your events via ${brandName || "Blue Eye Entertainment"}. Premium entertainment at your fingertips.`,
  longDescription: `${brandName || "Blue Eye Entertainment"} is India's leading platform for booking premium entertainment. From Bollywood singers and high-energy DJs to corporate comedians and live bands, we provide high-quality artist management services for weddings, corporate events, and private parties.`,
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://blueeyeentertainment.in",
  ogImage: `${process.env.NEXT_PUBLIC_BASE_URL || "https://blueeyeentertainment.in"}/icon.png`,
  author: `${brandName || "Blue Eye Entertainment"} Team`,
  mainKeywords: [
    "blueeyeentertainment",
    "blue eye entertainment",
    "blue eyeentertainment",
    "Blue Eye Entertainment",
    "BlueEyeEntertainment",
    "Blue Eye",
    "BlueEye",
    "atrist booking",
    "artist booking website",
    "cheap artist booking",
    "affordable artist booking india",
    "book bollywood singers",
    "hire famous singers india",
    "wedding entertainment india",
    "hire djs for corporate events",
    "live music bands for hire",
    "premium event entertainment",
    "artist management agency",
    "book stand up comedians",
    "hire celebrity for wedding",
    "indian artist booking agency",
    "book musicians for events",
    "live concert organizers india",
    "book rappers in india",
    "hire live bands for sangeet",
    "corporate event entertainment ideas",
    "book famous singers",
    "hire emcee for event",
    "book anchors for corporate events",
    "talent management company india",
    "celebrity management agency india",
    "hire instrumentalists",
    "book sufi singers",
    "hire punjabi singers",
    "wedding dj booking",
    "event entertainment services",
    "live performance booking",
    "top artist management companies",
    "book performers for private parties",
    "entertainment booking agency",
    "book local artists india",
    "artist booking app",
    "hire models for events",
    "book magicians india",
    "best wedding bands india",
    "hire dancers for wedding",
    "hire influencers india",
    "celebrity appearance booking",
    "book ghazal singers",
    "hire folk singers india"
  ],
  links: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL,
  },
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
};




