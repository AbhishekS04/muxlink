import {
  Github,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  Send,
  MessageSquare,
  Camera,
  MapPin,
  ExternalLink,
} from "lucide-react"

export const socialIcons = {
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  telegram: Send,
  discord: MessageSquare,
  threads: MessageSquare,
  snapchat: Camera,
  pinterest: MapPin,
  twitter: ExternalLink, // Using ExternalLink for X/Twitter
  x: ExternalLink,
  default: ExternalLink,
}

export function getSocialIcon(url: string) {
  const domain = url.toLowerCase()

  if (domain.includes("github.com")) return socialIcons.github
  if (domain.includes("instagram.com")) return socialIcons.instagram
  if (domain.includes("facebook.com")) return socialIcons.facebook
  if (domain.includes("linkedin.com")) return socialIcons.linkedin
  if (domain.includes("youtube.com")) return socialIcons.youtube
  if (domain.includes("whatsapp.com") || domain.includes("wa.me")) return socialIcons.whatsapp
  if (domain.includes("telegram.org") || domain.includes("t.me")) return socialIcons.telegram
  if (domain.includes("discord.com")) return socialIcons.discord
  if (domain.includes("threads.net")) return socialIcons.threads
  if (domain.includes("snapchat.com")) return socialIcons.snapchat
  if (domain.includes("pinterest.com")) return socialIcons.pinterest
  if (domain.includes("twitter.com") || domain.includes("x.com")) return socialIcons.x

  return socialIcons.default
}

export function getSocialColor(url: string): string {
  const domain = url.toLowerCase()

  if (domain.includes("github.com")) return "#f5f5f5"
  if (domain.includes("instagram.com")) return "#E4405F"
  if (domain.includes("facebook.com")) return "#1877F2"
  if (domain.includes("linkedin.com")) return "#0A66C2"
  if (domain.includes("youtube.com")) return "#FF0000"
  if (domain.includes("whatsapp.com") || domain.includes("wa.me")) return "#25D366"
  if (domain.includes("telegram.org") || domain.includes("t.me")) return "#0088CC"
  if (domain.includes("discord.com")) return "#5865F2"
  if (domain.includes("threads.net")) return "#000000"
  if (domain.includes("snapchat.com")) return "#FFFC00"
  if (domain.includes("pinterest.com")) return "#BD081C"
  if (domain.includes("twitter.com") || domain.includes("x.com")) return "#000000"

  return "#f5f5f5"
}
