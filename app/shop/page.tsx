// app/shop/page.tsx
"use client";

import ParallaxBg from "@/components/visual/ParallaxBg";
import CollectionsSection from "@/components/collections/CollectionsSection";
import PageSection from "@/components/layout/PageSection";
import FancyTitle from "@/components/ui/FancyTitle";

export default function ShopPage() {
  // Nouveau : chemin vers posters.tsx
  const collectionBasePath = "/shop/posters";

  return (
    <>
      {/* Parallax en fond */}
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      <div className="relative z-10">
        
        {/* Petit titre / intro */}
        <PageSection variant="tight">
          <div className="w-full max-w-2xl mx-auto text-center">

            <FancyTitle
              title="Collection"
            />

          </div>
        </PageSection>

        {/* Liste des collections */}
        <CollectionsSection/>

      </div>
    </>
  );
}