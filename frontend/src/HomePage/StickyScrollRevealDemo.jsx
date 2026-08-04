"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Acne & Pimples",
    description:
      "We help detect and manage acne breakouts with targeted solutions that reduce inflammation, unclog pores, and restore skin balance.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white bg-pink-50">
        <img
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop"
          className="h-full w-full object-cover"
          loading="lazy"
          alt="Acne treatment illustration"
        />
      </div>
    ),
  },
  {
    title: "Dark Spots & Hyperpigmentation",
    description:
      "Our app identifies areas of discoloration and suggests effective treatments to even out skin tone and lighten dark patches caused by sun damage or post-acne marks.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white bg-pink-50">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop"
          className="h-full w-full object-cover"
          loading="lazy"
          alt="Hyperpigmentation treatment illustration"
        />
      </div>
    ),
  },
  {
    title: "Blackheads",
    description:
      "Bloom Skin detects blackhead-prone areas and suggests exfoliation methods and pore-care routines to keep your skin clean and smooth.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white bg-pink-50">
        <img
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop"
          className="h-full w-full object-cover"
          loading="lazy"
          alt="Blackhead treatment illustration"
        />
      </div>
    ),
  },
  {
    title: "Dry & Dehydrated Skin",
    description:
      "Bloom Skin recognizes signs of dryness and flakiness, offering hydration-focused care routines that restore moisture and protect your skin barrier.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white bg-pink-50">
        <img
          src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop"
          className="h-full w-full object-cover"
          loading="lazy"
          alt="Dry skin treatment illustration"
        />
      </div>
    ),
  }
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4 md:py-8 mt-10 md:mt-20 pt-10 md:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-neutral-800 dark:text-white">
          Skin Concerns We Address
        </h2>
        {/* Add overflow-hidden to hide scrollbar */}
        <div className="[&>div]:[-ms-overflow-style:none] [&>div]:[scrollbar-width:none] [&>div>div]:[-ms-overflow-style:none] [&>div>div]:[scrollbar-width:none]">
          <StickyScroll content={content} />
          <style jsx global>{`
            /* Hide scrollbar for Chrome, Safari and Opera */
            .sticky-scroll-container::-webkit-scrollbar,
            .sticky-scroll-content::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>

  );
}