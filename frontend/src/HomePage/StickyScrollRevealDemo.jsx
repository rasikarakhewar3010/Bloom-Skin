"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";


const content = [
  {
    title: "Acne & Pimples",
    description:
      "We help detect and manage acne breakouts with targeted solutions that reduce inflammation, unclog pores, and restore skin balance.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://mamaearth.in/blog/wp-content/uploads/2023/03/unnamed-11.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Dark Spots & Hyperpigmentation",
    description:
      "Our app identifies areas of discoloration and suggests effective treatments to even out skin tone and lighten dark patches caused by sun damage or post-acne marks.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNqllZva2-zhe6v8_IpVXVLDIXFKqs_OqThns7bQI2j4T4REwB-aVURSeYSaQlYn8z65s&usqp=CAU"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Blackheads ",
    description:
      "Bloom Skin detects blackhead-prone areas and suggests exfoliation methods and pore-care routines to keep your skin clean and smooth.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
      <img
        src="https://files.myglamm.com/site-images/original/What-Causes-Blackheads-On-The-Nose.png"
        width={300}
        height={300}
        className="h-full w-full object-cover"
        alt="linear board demo" />
    </div>
    ),
  },
  {
    title: "Dry & Dehydrated Skin",
    description:
      "Bloom Skin recognizes signs of dryness and flakiness, offering hydration-focused care routines that restore moisture and protect your skin barrier.                ",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://img.bebeautiful.in/www-bebeautiful-in/Treat-dehydrated%20-skin-to-reveal-the-flawless-you_mobilehome.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {

  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4 mt-10 pt-10">
      <StickyScroll content={content} />
    </div>
  );
}
