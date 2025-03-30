"use client";

import { HeroSection } from "@/components/home-page/HeroSection";
import { FeaturedJobsSection } from "@/components/home-page/FeaturedJobSection";
import { AboutSection } from "@/components/home-page/AboutSection";

import { useAuthCheck } from "@/lib/hooks/useAuthCheck";

export default function HomePage() {
  useAuthCheck();

  return (
    <div>
      <HeroSection />
      <FeaturedJobsSection />
      <AboutSection />
    </div>
  );
}

