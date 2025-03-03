"use client";

import { HeroSection } from "@/components/home-page/HeroSection";
import { CategoriesSection } from "@/components/home-page/CategoriesSection";
import { FeaturedJobsSection } from "@/components/home-page/FeaturedJobSection";
import { AboutSection } from "@/components/home-page/AboutSection";

import { useAuthCheck } from "@/lib/hooks/useAuthCheck";

export default function HomePage() {
  useAuthCheck();

  return (
    <div className="space-y-12 px-4">
      <HeroSection />
      <CategoriesSection />
      <FeaturedJobsSection />
      <AboutSection />
    </div>
  );
}

