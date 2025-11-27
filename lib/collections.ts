// lib/collectionss.ts
export type LangCode = "en" | "fr";

export type CollectionImage = {
  id: string;          // ex: "stillness.1"
  src: string;         // ex: "/collections/stillness/stillness.1.jpg"
  alt?: string;
};

export type Collection = {
  id: string;          // ex: "c1"
  slug: string;        // ex: "stillness-of-the-secret"
  title: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  images: CollectionImage[];
};

// 🌿 Collections Blossom – 6 collections, 6 images chacune
export const collections: Collection[] = [
  // 1 – Stillness of the Secret
  {
    id: "c1",
    slug: "stillness-of-the-secret",
    title: {
      en: "Stillness of the Secret",
      fr: "La Quiétude du Secret",
    },
    description: {
      en: "A collection inspired by traditional Asian gardens, where nature, architecture and serenity intertwine. Each illustration captures a moment of deep calm, like the memory of a place never visited yet strangely familiar, inviting you to travel with every glance.",
      fr: "Une collection inspirée des jardins traditionnels d’Asie, où chaque scène mêle nature, architecture et plénitude. Chaque illustration saisit un instant de calme profond, comme le souvenir d’un lieu jamais visité mais étrangement familier, offrant un véritable voyage à chaque regard.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `stillness.${i + 1}`,
      src: `/collections/stillness/stillness.${i + 1}.jpg`,
      alt: `Stillness of the Secret – image ${i + 1}`,
    })),
  },

  // 2 – Old Flower Museum
  {
    id: "c2",
    slug: "old-flower-museum",
    title: {
      en: "Old Flower Museum",
      fr: "Le Musée des Fleurs Anciennes",
    },
    description: {
      en: "A collection inspired by an old botanical museum, where every plant appears suspended in timeless light. These lush scenes capture nature’s preserved beauty, as if each specimen were displayed behind a gilded frame.",
      fr: "Une collection qui évoque un ancien musée botanique, où chaque plante semble figée dans une lumière intemporelle. Ces scènes luxuriantes capturent la beauté préservée de la nature, comme si chaque spécimen était exposé derrière une vitre dorée.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `museum.${i + 1}`,
      src: `/collections/museum/museum.${i + 1}.jpg`,
      alt: `Old Flower Museum – image ${i + 1}`,
    })),
  },

  // 3 – Golden Leaves
  {
    id: "c3",
    slug: "golden-leaves",
    title: {
      en: "Golden Leaves",
      fr: "Feuilles d’Or",
    },
    description: {
      en: "A collection bathed in gold, where every plant appears sculpted by light. These illustrations capture the delicate shine of nature, as if each leaf were adorned with precious metal.",
      fr: "Une collection baignée d’or, où chaque plante semble sculptée par la lumière. Ces illustrations capturent la brillance délicate du végétal, comme si la nature elle-même se parait de métal précieux.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `golden.${i + 1}`,
      src: `/collections/golden/golden.${i + 1}.jpg`,
      alt: `Golden Leaves – image ${i + 1}`,
    })),
  },

  // 4 – Old Greenhouse
  {
    id: "c4",
    slug: "old-greenhouse",
    title: {
      en: "Old Greenhouse",
      fr: "La Vieille Serre",
    },
    description: {
      en: "A collection capturing the magic of old greenhouses, where light filters through weathered glass to awaken climbing and exotic plants. Each scene reveals a preserved corner of nature, suspended between past and renewal.",
      fr: "Une collection qui capture la magie des serres anciennes, où la lumière traverse les vitres patinées pour réveiller les plantes grimpantes et exotiques. Chaque scène révèle un coin de nature protégée, suspendue entre passé et renaissance.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `greenhouse.${i + 1}`,
      src: `/collections/greenhouse/greenhouse.${i + 1}.jpg`,
      alt: `Old Greenhouse – image ${i + 1}`,
    })),
  },

  // 5 – Desert Bloom
  {
    id: "c5",
    slug: "desert-bloom",
    title: {
      en: "Desert Bloom",
      fr: "Floraisons du Désert",
    },
    description: {
      en: "A collection inspired by arid landscapes where life clings to stone and blooms under scorching light. Each scene reveals the resilient beauty of desert plants, shaped by sun and wind.",
      fr: "Une collection inspirée des paysages arides où la vie s’accroche à la roche et fleurit sous un soleil brûlant. Chaque scène révèle la beauté résistante des plantes du désert, sculptées par la lumière et le vent.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `desert.${i + 1}`,
      src: `/collections/desert/desert.${i + 1}.jpg`,
      alt: `Desert Bloom – image ${i + 1}`,
    })),
  },

  // 6 – Tropical Poetry
  {
    id: "c6",
    slug: "tropical-poetry",
    title: {
      en: "Tropical Poetry",
      fr: "Poésie Tropicale",
    },
    description: {
      en: "A collection where tropical flowers become silent verses, bathed in soft light and deep colors. Each scene reveals a gentle botanical poetry, like a stanza suspended in a dreamlike garden.",
      fr: "Une collection où les fleurs tropicales deviennent des vers silencieux, baignés de lumière et de couleurs profondes. Chaque scène révèle une douceur végétale, comme une strophe suspendue dans un jardin rêvé.",
    },
    images: Array.from({ length: 6 }).map((_, i) => ({
      id: `poetry.${i + 1}`,
      src: `/collections/poetry/poetry.${i + 1}.jpg`,
      alt: `Tropical Poetry – image ${i + 1}`,
    })),
  },
];