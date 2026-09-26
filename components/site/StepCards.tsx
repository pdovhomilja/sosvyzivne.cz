export type Step = { title: string; text: React.ReactNode };

export const HOW_IT_WORKS: Step[] = [
  { title: "Pošlete nám rozsudek", text: "Kopii rozhodnutí soudu, které stanovuje výši výživného. Stačí fotka." },
  { title: "Podepíšete plnou moc", text: "Abychom vás mohli zastupovat před úřady a exekutorem." },
  { title: "Zbytek zařídíme my", text: "Administrativu, návrhy i komunikaci s exekutorským úřadem." },
];

export function StepCards({ steps = HOW_IT_WORKS }: { steps?: Step[] }) {
  return (
    <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="flex min-h-[250px] flex-col gap-3 rounded-3xl bg-sand p-7 max-md:min-h-0">
          <span className="font-accent text-[80px] italic leading-[.8] text-rose" aria-hidden>
            {i + 1}
          </span>
          <h3 className="text-[26px] font-semibold tracking-[-.02em] text-plum">{s.title}</h3>
          <p className="text-base text-wine-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
