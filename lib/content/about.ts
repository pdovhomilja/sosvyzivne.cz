/** O nás copy, drawn from the 2023–2025 annual reports. */
export const ABOUT = {
  story: [
    "SOS výživné vzniklo v roce 2019. Na začátku stála myšlenka pomáhat lidem, kterým druhý rodič neplatí výživné a kteří na vymáhání nemají sílu ani prostředky.",
    "Abychom mohli pracovat co nejprůhledněji a všechny prostředky věnovat klientům, převedli jsme se v roce 2023 do podoby nadačního fondu. Každý rok zveřejňujeme výroční zprávu s hospodařením, dary i statistikami.",
    "Kromě právní a administrativní pomoci klademe důraz na lidský přístup. Od roku 2025 nabízíme také mediaci, tedy mimosoudní cestu k dohodě mezi rodiči.",
  ],
  partners: [
    { name: "Exekutorský úřad Plzeň-jih", note: "klíčový partner při vymáhání" },
    { name: "Nadace Agrofert", note: "dar 100 000 Kč v roce 2025" },
    { name: "SOS rodině s.r.o.", note: "úhrada provozních nákladů" },
  ],
};

/** Files Lenka sent for download (e-mail 30. 9. 2026); the stories are published with the clients' consent. */
export const DOWNLOADS = [
  { href: "/dokumenty/letacek-pro-klienty.pdf", label: "Letáček pro klienty", note: "PDF" },
  { href: "/dokumenty/predstaveni-fondu.pdf", label: "Představení nadačního fondu", note: "PDF" },
  { href: "/dokumenty/pribeh-hana.pdf", label: "Příběh klientky: Hana", note: "PDF" },
  { href: "/dokumenty/pribeh-jana.pdf", label: "Příběh klientky: Jana", note: "PDF" },
  { href: "/dokumenty/pribeh-katerina.pdf", label: "Příběh klientky: Kateřina", note: "PDF" },
  { href: "/logo/SOS_logo_landscape-RGB.png", label: "Logo SOS výživné (na šířku)", note: "PNG" },
  { href: "/logo/SOS_logo_compact-RGB.png", label: "Logo SOS výživné (kompaktní)", note: "PNG" },
] as const;
