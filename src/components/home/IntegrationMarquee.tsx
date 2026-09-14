import Image from "next/image";

const PLATFORMS = [
  { name: "LinkedIn", logo: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128" },
  { name: "Jobstreet", logo: "https://www.google.com/s2/favicons?domain=jobstreet.co.id&sz=128" },
  { name: "Dealls", logo: "https://www.google.com/s2/favicons?domain=dealls.com&sz=128" },
  { name: "Glints", logo: "https://www.google.com/s2/favicons?domain=glints.com&sz=128" },
  { name: "Kalibrr", logo: "https://www.google.com/s2/favicons?domain=kalibrr.com&sz=128" },
  { name: "Tech in Asia", logo: "https://www.google.com/s2/favicons?domain=techinasia.com&sz=128" },
  { name: "Karir.com", logo: "https://www.google.com/s2/favicons?domain=karir.com&sz=128" },
];

const COMPANIES = [
  { name: "Gojek", logo: "https://www.google.com/s2/favicons?domain=gojek.com&sz=128" },
  { name: "Tokopedia", logo: "https://www.google.com/s2/favicons?domain=tokopedia.com&sz=128" },
  { name: "Traveloka", logo: "https://www.google.com/s2/favicons?domain=traveloka.com&sz=128" },
  { name: "Bukalapak", logo: "https://www.google.com/s2/favicons?domain=bukalapak.com&sz=128" },
  { name: "Shopee", logo: "https://www.google.com/s2/favicons?domain=shopee.co.id&sz=128" },
  { name: "Grab", logo: "https://www.google.com/s2/favicons?domain=grab.com&sz=128" },
  { name: "Tiket.com", logo: "https://www.google.com/s2/favicons?domain=tiket.com&sz=128" },
  { name: "Ruangguru", logo: "https://www.google.com/s2/favicons?domain=ruangguru.com&sz=128" },
  { name: "Bank BCA", logo: "https://www.google.com/s2/favicons?domain=bca.co.id&sz=128" },
  { name: "Bank Mandiri", logo: "https://www.google.com/s2/favicons?domain=bankmandiri.co.id&sz=128" },
  { name: "Telkomsel", logo: "https://www.google.com/s2/favicons?domain=telkomsel.com&sz=128" },
  { name: "Astra", logo: "https://www.google.com/s2/favicons?domain=astra.co.id&sz=128" },
];

// Combine them once (no duplication for simpler display)
const ALL_ITEMS = [...PLATFORMS, ...COMPANIES];

export default function IntegrationMarquee() {
  return (
    <section className="py-12 bg-surface" id="integrations">
      <div className="container-content">
        <h2 className="text-h2 text-ink mb-6 text-center">
          Terintegrasi dengan Platform Terpercaya
        </h2>
        <p className="text-body text-text-muted max-w-2xl mx-auto mb-8 text-center">
          Kami mengumpulkan lowongan dari berbagai platform dan perusahaan terkemuka untuk memberikan peluang kerja yang terbaik bagi Anda.
        </p>

        <div className="overflow-hidden">
          <div className="flex flex-wrap justify-center gap-4">
            {ALL_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <Image src={item.logo} alt={item.name} width={32} height={32} className="object-contain" />
                <span className="text-white/70 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
