// app/shop/[slug]/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { collections } from "@/lib/collections";
import ParallaxBg from "@/components/visual/ParallaxBg";
import PageSection from "@/components/layout/PageSection";
import CollectionGrid from "@/components/collections/CollectionGrid";
import { useLang } from "@/hooks/useLang";
import FancyTitle from "@/components/ui/FancyTitle";

export default function DynamicCollectionPage({ params }: { params: { slug: string } }) {
  const { lang } = useLang();
  const collection = collections.find(c => c.slug === params.slug);

  if (!collection) {
    return (
      <PageSection>
        <p className="text-center text-red-500 mt-10">Collection not found.</p>
      </PageSection>
    );
  }

  return (
    <>
      {/* Background */}
      <ParallaxBg small="/background_small.jpg" big="/background_big.jpg" />

      <div className="relative z-10">
        <PageSection variant="tight">
          <div className="max-w-3xl mx-auto text-center mb-10">
            
          <FancyTitle
            title={collection.title[lang]}
            description={collection.description[lang]}
          />

          </div>
        </PageSection>

        {/* Posters grid */}
        <PageSection>
          <CollectionGrid images={collection.images} />
        </PageSection>
      </div>
    </>
  );
}