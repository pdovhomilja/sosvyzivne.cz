/** Every photo used on the public site, with alt text and credit. See docs/photo-credits.md. */
type Img = { src: string; alt: string; width: number; height: number; credit: string };

export const IMG = {
  heroMomDaughter: { src: "/images/site/hero/mom-daughter-sofa.jpg", alt: "Maminka s dcerou na gauči", width: 933, height: 1400, credit: "Unsplash" },
  heroMomSonKitchen: { src: "/images/site/hero/mom-son-kitchen.jpg", alt: "Maminka se synem v kuchyni", width: 1400, height: 934, credit: "Pexels" },
  heroWindow: { src: "/images/site/hero/mom-child-window.jpg", alt: "Maminka s malou dcerou u okna", width: 933, height: 1400, credit: "Pexels" },
  heroPaperwork: { src: "/images/site/hero/paperwork-kitchen.jpg", alt: "Žena čte dokumenty v kuchyni", width: 1400, height: 788, credit: "Unsplash" },
  topicMomHug: { src: "/images/site/topics/mom-hug.jpg", alt: "Maminka objímá dceru", width: 933, height: 1400, credit: "Unsplash" },
  topicPaperwork: { src: "/images/site/topics/paperwork-laptop.jpg", alt: "Práce u stolu s dokumenty", width: 1400, height: 934, credit: "Unsplash" },
  topicStudent: { src: "/images/site/topics/student-train.jpg", alt: "Student s batohem čeká na vlak", width: 1400, height: 933, credit: "Unsplash" },
  blogWalk: { src: "/images/site/blog/walk.jpg", alt: "Maminka vede malého syna za ruku", width: 933, height: 1400, credit: "Unsplash" },
  blogStreet: { src: "/images/site/blog/street.jpg", alt: "Maminka se synem na ulici", width: 1050, height: 1400, credit: "Unsplash" },
  lenka: { src: "/images/site/team/lenka.jpg", alt: "PhDr. Lenka Ranšová, DiS., ředitelka SOS výživné", width: 400, height: 602, credit: "SOS výživné" },
  teamErik: { src: "/images/site/team/erik.jpg", alt: "Erik Žákovec", width: 209, height: 337, credit: "SOS výživné" },
  teamEva: { src: "/images/site/team/eva.jpg", alt: "Eva Koukolíková", width: 308, height: 410, credit: "SOS výživné" },
  teamMacek: { src: "/images/site/team/macek.jpg", alt: "Mgr. Daniel Macek", width: 298, height: 371, credit: "SOS výživné" },
  teamBorutova: { src: "/images/site/team/borutova.jpg", alt: "Mgr. Zuzana Bořutová", width: 298, height: 371, credit: "SOS výživné" },
  teamLudek: { src: "/images/site/team/ludek.jpg", alt: "JUDr. PhDr. Luděk Žákovec, Ph.D.", width: 492, height: 700, credit: "SOS výživné" },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof IMG;
