import type { Metadata } from "next";

export const SITE_NAME = "Delux Tech Gadget";
export const DEFAULT_SHARE_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME };

// Next replaces the whole openGraph object when a page sets one, so every
// page goes through this to keep the share image.
export function pageMetadata(title: string, description: string, image?: string): Metadata {
  const images = image ? [{ url: image, alt: title }] : [DEFAULT_SHARE_IMAGE];
  return {
    title,
    description,
    openGraph: { type: "website", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: images.map((i) => i.url) },
  };
}
