import Image from "next/image";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";
import { Container } from "@/components/ui/container";

const CARDS = [
  {
    title: "Rodič samoživitel/ka",
    text: "Pečujete o nezaopatřené dítě a druhý rodič neplatí stanovené výživné včas nebo vůbec.",
  },
  {
    title: "Rozvedený/á",
    text: "Máte pravomocný rozsudek o výživném, který ale není protistranou respektován.",
  },
  {
    title: "Plnoletý student",
    text: "Studujete a vaši rodiče si neplní vyživovací povinnost k vám jako k dospělému dítěti.",
  },
];

export function AudienceCards() {
  const imgs = pageImages("home");
  // Audience cards use images at indices 2, 3, 4
  const cardImgs = [imgs[2], imgs[3], imgs[4]];

  return (
    <section className="py-24 bg-peach-light">
      <Container>
        <h2 className="font-heading text-4xl text-ink text-center mb-4">
          Mám nárok na vaši službu?
        </h2>
        <p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">
          Naše bezplatná pomoc je určena těmto skupinám:
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="overflow-hidden rounded-xl mb-6 aspect-square">
                <Image
                  src={imgSrc(cardImgs[i])}
                  alt={altText(cardImgs[i])}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-ink-muted">{card.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
